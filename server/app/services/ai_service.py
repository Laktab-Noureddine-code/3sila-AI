import time
import requests
from typing import List
from sqlmodel import Session, select
from app.core.config import settings
from app.core.database import engine
from app.models.system_config import SystemConfig
from app.core.security_encryption import encryption_service

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"
MAX_CHUNK_SIZE = 20000
RPM_SLEEP = 4  # Seconds to sleep between requests to respect 15 RPM limit

def split_text_into_chunks(text: str, max_size: int = MAX_CHUNK_SIZE) -> List[str]:
    """
    Split text into chunks of maximum `max_size` characters, 
    trying to break at logical boundaries (. or \n).
    """
    if len(text) <= max_size:
        return [text]
    
    chunks = []
    current_pos = 0
    total_len = len(text)
    
    while current_pos < total_len:
        if total_len - current_pos <= max_size:
            chunks.append(text[current_pos:])
            break
            
        # Find best split point
        end_pos = current_pos + max_size
        
        # Look for period or newline in the last 10% of the chunk to avoid cutting sentences
        search_start = max(current_pos, end_pos - int(max_size * 0.1))
        chunk_candidate = text[search_start:end_pos]
        
        # Priority: Newline > Period > Space
        last_newline = chunk_candidate.rfind('\n')
        last_period = chunk_candidate.rfind('.')
        last_space = chunk_candidate.rfind(' ')
        
        if last_newline != -1:
            split_point = search_start + last_newline + 1
        elif last_period != -1:
            split_point = search_start + last_period + 1
        elif last_space != -1:
            split_point = search_start + last_space + 1
        else:
            # Force split if no boundary found
            split_point = end_pos
            
        chunks.append(text[current_pos:split_point])
        current_pos = split_point
        
    return chunks

def call_gemini(prompt: str) -> str:
    # 1. Rate Limiting Sleep
    # Identify if we need to sleep BEFORE or AFTER. 
    # Safest is before if we want to guarantee spacing between calls from this worker.
    # Users requested 4 seconds.
    time.sleep(RPM_SLEEP)

    # 2. Try to get key from DB
    api_key = None
    try:
        with Session(engine) as session:
            config = session.get(SystemConfig, "gemini_api_key")
            if config:
                api_key = encryption_service.decrypt(config.value)
    except Exception as e:
        print(f"Error fetching API key from DB: {e}")

    # 3. Fallback to env file
    if not api_key:
        api_key = settings.GEMINI_API_KEY

    if not api_key:
        return "Error: GEMINI_API_KEY not configured."
    
    url = f"{GEMINI_API_URL}?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }

    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            
            if response.status_code == 429:
                wait_time = (2 ** attempt) + RPM_SLEEP # Exponential backoff + Safety buffer
                print(f"Rate limited (429). Retrying in {wait_time}s...")
                time.sleep(wait_time)
                continue
                
            response.raise_for_status()
            data = response.json()
            return data['candidates'][0]['content']['parts'][0]['text']
            
        except requests.exceptions.RequestException as e:
            if attempt == max_retries - 1:
                print(f"Gemini API Error after {max_retries} retries: {e}")
                return f"Error calling Gemini API: {e}"
            # Add a small delay handled by the loop/sleep above if we continue, 
            # but for non-429 errors, maybe just a short retry or fail is better.
            # We'll just continue to retry.
            time.sleep(2) 
            continue
        except (KeyError, IndexError) as e:
            print(f"Gemini Response Parse Error: {e}")
            return "Error parsing AI response."
            
    return "Error: Failed to connect to AI service."

def summarize_text(text: str) -> str:
    # Note: Summarization for very large texts usually requires map-reduce. 
    # For now, we apply basic chunking if it exceeds limit, but 
    # ideally we would summarize chunks then summarize the result.
    # Given the prompt focused on translation chunking, we'll keep this simple for now
    # or apply the same chunking but just call it once if safe.
    # However, if text > 20k, single call fails.
    # Let's truncate or let user know. For strictness to user request, 
    # "Implement Chunking for Translation".
    return call_gemini(f"Summarize this text concisely: {text}")

def translate_text(text: str, target_lang: str) -> str:
    chunks = split_text_into_chunks(text)
    translated_chunks = []
    
    for i, chunk in enumerate(chunks):
        if len(chunks) > 1:
            print(f"Translating chunk {i+1}/{len(chunks)}...")
            
        prompt = f"Translate the following text to {target_lang}. Return ONLY the translation: {chunk}"
        result = call_gemini(prompt)
        
        if result.startswith("Error"):
             return f"Translation failed at chunk {i+1}: {result}"
             
        translated_chunks.append(result)
        
    return " ".join(translated_chunks)
