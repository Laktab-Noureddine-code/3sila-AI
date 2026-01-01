import google.generativeai as genai
from app.core.config import settings
import os

# Load env vars manually if needed, or rely on settings if .env is loaded
# settings relies on pydantic-settings which loads .env automatically if present

try:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    
    print("Listing available models...")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"Error: {e}")
