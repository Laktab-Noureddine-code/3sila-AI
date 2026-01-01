import requests
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # Fallback to the known key if .env fails for some reason
    api_key = "AIzaSyB6iYbKYIC2XiRliFNz34GfXy8pOWfDBI8"

url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

try:
    response = requests.get(url)
    response.raise_for_status()
    models = response.json().get('models', [])
    print("Available Models:")
    for m in models:
        print(f"- {m['name']}")
    
    if not models:
        print("No models found. Check permissions?")

except Exception as e:
    print(f"Error listing models: {e}")
    if response:
        print(f"Response: {response.text}")
