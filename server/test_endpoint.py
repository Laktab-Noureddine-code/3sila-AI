import requests
import time

# 1. Login to get token
try:
    print("Logging in...")
    auth_response = requests.post(
        "http://127.0.0.1:8000/auth/login",
        data={"username": "test@example.com", "password": "password123"}
    )
    
    # Check if user exists, if not signup
    if auth_response.status_code == 400:
        print("User not found, creating user...")
        signup_response = requests.post(
            "http://127.0.0.1:8000/auth/signup",
            json={"email": "test@example.com", "password": "password123", "name": "Test User"}
        )
        print(f"Signup Status: {signup_response.status_code}")
        # Login again
        auth_response = requests.post(
            "http://127.0.0.1:8000/auth/login",
            data={"username": "test@example.com", "password": "password123"}
        )

    if auth_response.status_code != 200:
        print(f"Login Failed: {auth_response.text}")
        exit()

    token = auth_response.json()["access_token"]
    print("Login Successful.")

    # 2. Call Analyze Endpoint
    print("\nSending analysis request (This may take 10-30 seconds)...")
    start_time = time.time()
    
    response = requests.post(
        "http://127.0.0.1:8000/tools/analyze",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "text": "Artificial Intelligence is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans.",
            "target_lang": "French"
        }
    )
    
    duration = time.time() - start_time
    print(f"\nRequest finished in {duration:.2f} seconds.")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")

except Exception as e:
    print(f"An error occurred: {e}")
