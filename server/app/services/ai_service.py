import requests
from app.core.config import settings

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"

def call_gemini(prompt: str) -> str:
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return "Error: GEMINI_API_KEY not configured."

    import time
    
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
                wait_time = 2 ** attempt # Exponential backoff: 1s, 2s, 4s...
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
            continue
        except (KeyError, IndexError) as e:
            print(f"Gemini Response Parse Error: {e}")
            return "Error parsing AI response."
            
    return "Error: Failed to connect to AI service."

def summarize_text(text: str) -> str:
    prompt = f"Summarize this text concisely: {text}"
    return call_gemini(prompt)

def translate_text(text: str, target_lang: str) -> str:
    prompt = f"Translate the following text to {target_lang}. Return ONLY the translation: {text}"
    return call_gemini(prompt)
