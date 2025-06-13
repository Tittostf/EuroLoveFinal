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
ESCORT_EMAIL = "isabella@example.com"
ESCORT_PASSWORD = "password123"

# Test data
TEST_CLIENT = {
    "username": f"testclient_{int(time.time())}",
    "email": f"testclient_{int(time.time())}@example.com",
    "password": "password123",
    "user_type": "client"
}

TEST_ESCORT = {
    "username": f"testescort_{int(time.time())}",
    "email": f"testescort_{int(time.time())}@example.com",
    "password": "password123",
    "user_type": "escort",
    "name": "Test Escort",
    "age": 25,
    "location": "Paris, France",
    "services": ["massage", "companionship"]
}

# Store tokens and user IDs
tokens = {
    "admin": None,
    "client": None,
    "escort": None
}

user_ids = {
    "admin": None,
    "client": None,
    "escort": None
}

# Test results tracking
test_results = {
    "total": 0,
    "passed": 0,
    "failed": 0,
    "failures": []
}

def print_header(message):
    print("\n" + "=" * 80)
    print(f" {message}")
    print("=" * 80)

def print_test(message):
    print(f"\n[TEST] {message}")

def print_success(message):
    print(f"[✓] {message}")
    test_results["passed"] += 1
    test_results["total"] += 1

def print_failure(message, error=None):
    print(f"[✗] {message}")
    if error:
        print(f"    Error: {error}")
    test_results["failed"] += 1
    test_results["total"] += 1
    test_results["failures"].append({"test": message, "error": str(error) if error else None})

def print_summary():
    print("\n" + "=" * 80)
    print(f" TEST SUMMARY: {test_results['passed']}/{test_results['total']} tests passed")
    print("=" * 80)
    
    if test_results["failed"] > 0:
        print("\nFailed tests:")
        for i, failure in enumerate(test_results["failures"], 1):
            print(f"{i}. {failure['test']}")
            if failure["error"]:
                print(f"   Error: {failure['error']}")
    
    print(f"\nPassed: {test_results['passed']}")
    print(f"Failed: {test_results['failed']}")
    print(f"Total: {test_results['total']}")

def test_health_check():
    print_test("Health Check Endpoint")
    try:
        response = requests.get(f"{API_URL}/health")
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "healthy":
                print_success("Health check endpoint is working")
            else:
                print_failure("Health check endpoint returned unexpected data", data)
        else:
            print_failure("Health check endpoint returned non-200 status code", response.status_code)
    except Exception as e:
        print_failure("Health check endpoint request failed", e)

def test_register_user(user_data, user_type):
    print_test(f"Register {user_type.capitalize()} User")
    try:
        response = requests.post(f"{API_URL}/register", json=user_data)
        if response.status_code == 200:
            data = response.json()
            if data.get("token") and data.get("user"):
                tokens[user_type] = data["token"]
                user_ids[user_type] = data["user"]["id"]
                print_success(f"{user_type.capitalize()} registration successful")
                return True
            else:
                print_failure(f"{user_type.capitalize()} registration response missing token or user data", data)
        else:
            print_failure(f"{user_type.capitalize()} registration failed with status code {response.status_code}", response.text)
    except Exception as e:
        print_failure(f"{user_type.capitalize()} registration request failed", e)
    return False

def test_login_user(email, password, user_type):
    print_test(f"Login {user_type.capitalize()} User")
    try:
        response = requests.post(f"{API_URL}/login", json={"email": email, "password": password})
        if response.status_code == 200:
            data = response.json()
            if data.get("token") and data.get("user"):
                tokens[user_type] = data["token"]
                user_ids[user_type] = data["user"]["id"]
                print_success(f"{user_type.capitalize()} login successful")
                return True
            else:
                print_failure(f"{user_type.capitalize()} login response missing token or user data", data)
        else:
            print_failure(f"{user_type.capitalize()} login failed with status code {response.status_code}", response.text)
    except Exception as e:
        print_failure(f"{user_type.capitalize()} login request failed", e)
    return False

def test_send_gift():
    print_test("Send Gift Functionality")
    if not tokens["client"]:
        print_failure("Send gift test skipped - client token not available")
        return
    
    if not user_ids["escort"]:
        print_failure("Send gift test skipped - escort ID not available")
        return
    
    try:
        gift_data = {
            "recipient_id": user_ids["escort"],
            "gift_name": "Champagne",
            "gift_value": 10.0
        }
        
        headers = {"Authorization": f"Bearer {tokens['client']}"}
        response = requests.post(f"{API_URL}/send-gift", json=gift_data, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Gift sent successfully" and data.get("gift_id"):
                print_success("Gift sent successfully")
            else:
                print_failure("Gift sending response unexpected", data)
        else:
            print_failure(f"Gift sending failed with status code {response.status_code}", response.text)
    except Exception as e:
        print_failure("Gift sending request failed", e)

def test_repost():
    print_test("Repost Functionality")
    if not tokens["escort"]:
        print_failure("Repost test skipped - escort token not available")
        return
    
    if not user_ids["escort"]:
        print_failure("Repost test skipped - escort ID not available")
        return
    
    try:
        repost_data = {
            "escort_id": user_ids["escort"]
        }
        
        headers = {"Authorization": f"Bearer {tokens['escort']}"}
        response = requests.post(f"{API_URL}/repost", json=repost_data, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Ad reposted successfully" and data.get("repost_id"):
                print_success("Repost successful")
            else:
                print_failure("Repost response unexpected", data)
        else:
            print_failure(f"Repost failed with status code {response.status_code}", response.text)
    except Exception as e:
        print_failure("Repost request failed", e)

def test_client_leaderboard():
    print_test("Client Leaderboard")
    try:
        response = requests.get(f"{API_URL}/leaderboard-clients")
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_success("Client leaderboard retrieved successfully")
            else:
                print_failure("Client leaderboard response not a list", data)
        else:
            print_failure(f"Client leaderboard failed with status code {response.status_code}", response.text)
    except Exception as e:
        print_failure("Client leaderboard request failed", e)

def test_escort_leaderboard():
    print_test("Escort Leaderboard")
    try:
        response = requests.get(f"{API_URL}/leaderboard-escorts")
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_success("Escort leaderboard retrieved successfully")
            else:
                print_failure("Escort leaderboard response not a list", data)
        else:
            print_failure(f"Escort leaderboard failed with status code {response.status_code}", response.text)
    except Exception as e:
        print_failure("Escort leaderboard request failed", e)

def test_admin_stats():
    print_test("Admin Dashboard Statistics")
    if not tokens["admin"]:
        print_failure("Admin stats test skipped - admin token not available")
        return
    
    try:
        headers = {"Authorization": f"Bearer {tokens['admin']}"}
        response = requests.get(f"{API_URL}/admin/stats", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["total_revenue", "total_gifts", "total_reposts", 
                              "total_clients", "total_escorts", "top_clients", "top_escorts"]
            
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields:
                print_success("Admin statistics retrieved successfully")
            else:
                print_failure(f"Admin statistics missing fields: {', '.join(missing_fields)}", data)
        else:
            print_failure(f"Admin statistics failed with status code {response.status_code}", response.text)
    except Exception as e:
        print_failure("Admin statistics request failed", e)

def test_escorts_discovery():
    print_test("Escorts Discovery")
    try:
        response = requests.get(f"{API_URL}/escorts")
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_success("Escorts list retrieved successfully")
            else:
                print_failure("Escorts list response not a list", data)
        else:
            print_failure(f"Escorts list failed with status code {response.status_code}", response.text)
    except Exception as e:
        print_failure("Escorts list request failed", e)

def test_profile():
    print_test("User Profile")
    if not tokens["client"]:
        print_failure("Profile test skipped - client token not available")
        return
    
    try:
        headers = {"Authorization": f"Bearer {tokens['client']}"}
        response = requests.get(f"{API_URL}/profile", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["id", "username", "user_type", "credits", "points"]
            
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields:
                print_success("User profile retrieved successfully")
            else:
                print_failure(f"User profile missing fields: {', '.join(missing_fields)}", data)
        else:
            print_failure(f"User profile failed with status code {response.status_code}", response.text)
    except Exception as e:
        print_failure("User profile request failed", e)

def test_gift_history():
    print_test("Gift History")
    if not tokens["client"]:
        print_failure("Gift history test skipped - client token not available")
        return
    
    try:
        headers = {"Authorization": f"Bearer {tokens['client']}"}
        response = requests.get(f"{API_URL}/gift-history", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_success("Gift history retrieved successfully")
            else:
                print_failure("Gift history response not a list", data)
        else:
            print_failure(f"Gift history failed with status code {response.status_code}", response.text)
    except Exception as e:
        print_failure("Gift history request failed", e)

def test_repost_history():
    print_test("Repost History")
    if not tokens["escort"]:
        print_failure("Repost history test skipped - escort token not available")
        return
    
    try:
        headers = {"Authorization": f"Bearer {tokens['escort']}"}
        response = requests.get(f"{API_URL}/repost-history", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_success("Repost history retrieved successfully")
            else:
                print_failure("Repost history response not a list", data)
        else:
            print_failure(f"Repost history failed with status code {response.status_code}", response.text)
    except Exception as e:
        print_failure("Repost history request failed", e)

def test_add_credits():
    print_test("Add Credits")
    if not tokens["client"]:
        print_failure("Add credits test skipped - client token not available")
        return
    
    try:
        headers = {"Authorization": f"Bearer {tokens['client']}"}
        response = requests.post(f"{API_URL}/add-credits?amount=50", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") and "new_balance" in data:
                print_success("Credits added successfully")
            else:
                print_failure("Add credits response unexpected", data)
        else:
            print_failure(f"Add credits failed with status code {response.status_code}", response.text)
    except Exception as e:
        print_failure("Add credits request failed", e)

def run_all_tests():
    print_header("EUROLOVE BACKEND API TESTING")
    print(f"Testing against: {API_URL}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Basic health check
    test_health_check()
    
    # Authentication tests
    admin_logged_in = test_login_user(ADMIN_EMAIL, ADMIN_PASSWORD, "admin")
    
    # Try to register new test users
    client_registered = test_register_user(TEST_CLIENT, "client")
    escort_registered = test_register_user(TEST_ESCORT, "escort")
    
    # If registration failed, try to login with existing test credentials
    if not client_registered:
        test_login_user(TEST_CLIENT["email"], TEST_CLIENT["password"], "client")
    
    if not escort_registered:
        test_login_user(TEST_ESCORT["email"], TEST_ESCORT["password"], "escort")
    
    # If we still don't have tokens, try the provided escort credentials
    if not tokens["escort"]:
        test_login_user(ESCORT_EMAIL, ESCORT_PASSWORD, "escort")
    
    # Test core functionality
    test_send_gift()
    test_repost()
    test_client_leaderboard()
    test_escort_leaderboard()
    test_admin_stats()
    test_escorts_discovery()
    
    # Test additional endpoints
    test_profile()
    test_gift_history()
    test_repost_history()
    test_add_credits()
    
    # Print summary
    print_summary()
    
    # Return exit code based on test results
    return 1 if test_results["failed"] > 0 else 0

if __name__ == "__main__":
    sys.exit(run_all_tests())
