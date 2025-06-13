#!/usr/bin/env python3
import requests
import json
import time
import sys
from datetime import datetime

# Backend URL from frontend/.env
BACKEND_URL = "https://3ddf4ec2-148c-4a68-ae5a-5b9c62b60c80.preview.emergentagent.com"
API_URL = f"{BACKEND_URL}/api"

# Test credentials
ADMIN_EMAIL = "admin@eurolove.com"
ADMIN_PASSWORD = "admin123"

def print_header(message):
    print("\n" + "=" * 80)
    print(f" {message}")
    print("=" * 80)

def login_admin():
    print("Logging in as admin...")
    try:
        response = requests.post(f"{API_URL}/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        if response.status_code == 200:
            data = response.json()
            if data.get("token"):
                print("Admin login successful")
                return data["token"]
            else:
                print("Admin login response missing token")
        else:
            print(f"Admin login failed with status code {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Admin login request failed: {e}")
    return None

def test_health_check():
    print("\nTesting health check endpoint...")
    try:
        response = requests.get(f"{API_URL}/health")
        print(f"Status code: {response.status_code}")
        if response.status_code == 200:
            print("Health check endpoint is working")
            return True
        else:
            print("Health check endpoint is not working")
            return False
    except Exception as e:
        print(f"Health check request failed: {e}")
        return False

def test_gift_history(token):
    print("\nTesting gift history endpoint...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{API_URL}/gift-history", headers=headers)
        print(f"Status code: {response.status_code}")
        if response.status_code == 200:
            print("Gift history endpoint is working")
            return True
        else:
            print("Gift history endpoint is not working")
            print(response.text)
            return False
    except Exception as e:
        print(f"Gift history request failed: {e}")
        return False

def test_repost_history(token):
    print("\nTesting repost history endpoint...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{API_URL}/repost-history", headers=headers)
        print(f"Status code: {response.status_code}")
        if response.status_code == 200:
            print("Repost history endpoint is working")
            return True
        else:
            print("Repost history endpoint is not working")
            print(response.text)
            return False
    except Exception as e:
        print(f"Repost history request failed: {e}")
        return False

def test_add_credits(token):
    print("\nTesting add credits endpoint...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(f"{API_URL}/add-credits?amount=50", headers=headers)
        print(f"Status code: {response.status_code}")
        if response.status_code == 200:
            print("Add credits endpoint is working")
            return True
        else:
            print("Add credits endpoint is not working")
            print(response.text)
            return False
    except Exception as e:
        print(f"Add credits request failed: {e}")
        return False

def main():
    print_header("EUROLOVE BACKEND API FIXES VERIFICATION")
    print(f"Testing against: {API_URL}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Login as admin to get token
    token = login_admin()
    if not token:
        print("Could not login as admin. Exiting.")
        return 1
    
    # Test the fixed endpoints
    health_check_working = test_health_check()
    gift_history_working = test_gift_history(token)
    repost_history_working = test_repost_history(token)
    add_credits_working = test_add_credits(token)
    
    # Print summary
    print_header("VERIFICATION SUMMARY")
    print(f"Health check endpoint: {'✓' if health_check_working else '✗'}")
    print(f"Gift history endpoint: {'✓' if gift_history_working else '✗'}")
    print(f"Repost history endpoint: {'✓' if repost_history_working else '✗'}")
    print(f"Add credits endpoint: {'✓' if add_credits_working else '✗'}")
    
    # Return exit code based on test results
    if health_check_working and gift_history_working and repost_history_working and add_credits_working:
        print("\nAll fixes have been verified successfully!")
        return 0
    else:
        print("\nSome fixes are still not working. Please check the logs for details.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
