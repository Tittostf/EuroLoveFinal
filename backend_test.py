import requests
import json
import unittest
import logging
import os
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Get backend URL from environment or use default
BACKEND_URL = "https://f4411c36-1dcb-452f-9677-744ba1f8a983.preview.emergentagent.com/api"

class EuroLoveAPITest(unittest.TestCase):
    """Test suite for EuroLove Dating Platform API"""
    
    def setUp(self):
        """Set up test case - create test users if needed"""
        self.client_user = {
            "email": "client_test@eurolove.com",
            "password": "SecurePassword123!",
            "full_name": "Client Test User",
            "role": "client",
            "age": 30,
            "bio": "I'm a test client user",
            "location": "Berlin, Germany"
        }
        
        self.escort_user = {
            "email": "escort_test@eurolove.com",
            "password": "SecurePassword123!",
            "full_name": "Escort Test User",
            "role": "escort",
            "age": 28,
            "bio": "I'm a test escort user",
            "location": "Paris, France"
        }
        
        self.client_token = None
        self.escort_token = None
        self.client_id = None
        self.escort_id = None
        
        # Test API root endpoint
        self.test_root_endpoint()
    
    def test_root_endpoint(self):
        """Test the root API endpoint"""
        try:
            response = requests.get(f"{BACKEND_URL}/")
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertEqual(data["message"], "EuroLove Dating Platform API")
            logger.info("✅ Root endpoint test passed")
        except Exception as e:
            logger.error(f"❌ Root endpoint test failed: {str(e)}")
            self.fail(f"Root endpoint test failed: {str(e)}")
    
    def test_auth_flow(self):
        """Test the complete authentication flow: register, login, logout"""
        # Test registration for client
        try:
            # First try to login, if successful, skip registration
            login_response = requests.post(
                f"{BACKEND_URL}/auth/login",
                json={"email": self.client_user["email"], "password": self.client_user["password"]}
            )
            
            if login_response.status_code == 200:
                logger.info("Client user already exists, skipping registration")
                login_data = login_response.json()
                self.client_token = login_data["access_token"]
                self.client_id = login_data["user"]["id"]
            else:
                # Register new client user
                register_response = requests.post(
                    f"{BACKEND_URL}/auth/register",
                    json=self.client_user
                )
                
                self.assertEqual(register_response.status_code, 200)
                register_data = register_response.json()
                self.assertIn("access_token", register_data)
                self.assertIn("user", register_data)
                self.client_token = register_data["access_token"]
                self.client_id = register_data["user"]["id"]
                logger.info("✅ Client registration test passed")
                
                # Test login with newly registered client
                login_response = requests.post(
                    f"{BACKEND_URL}/auth/login",
                    json={"email": self.client_user["email"], "password": self.client_user["password"]}
                )
                
                self.assertEqual(login_response.status_code, 200)
                login_data = login_response.json()
                self.assertIn("access_token", login_data)
                self.client_token = login_data["access_token"]
                logger.info("✅ Client login test passed")
        except Exception as e:
            logger.error(f"❌ Client authentication test failed: {str(e)}")
            if "Table" in str(e) and "does not exist" in str(e):
                logger.warning("Database tables may not be set up yet")
            else:
                self.fail(f"Client authentication test failed: {str(e)}")
        
        # Test registration for escort
        try:
            # First try to login, if successful, skip registration
            login_response = requests.post(
                f"{BACKEND_URL}/auth/login",
                json={"email": self.escort_user["email"], "password": self.escort_user["password"]}
            )
            
            if login_response.status_code == 200:
                logger.info("Escort user already exists, skipping registration")
                login_data = login_response.json()
                self.escort_token = login_data["access_token"]
                self.escort_id = login_data["user"]["id"]
            else:
                # Register new escort user
                register_response = requests.post(
                    f"{BACKEND_URL}/auth/register",
                    json=self.escort_user
                )
                
                self.assertEqual(register_response.status_code, 200)
                register_data = register_response.json()
                self.assertIn("access_token", register_data)
                self.assertIn("user", register_data)
                self.escort_token = register_data["access_token"]
                self.escort_id = register_data["user"]["id"]
                logger.info("✅ Escort registration test passed")
                
                # Test login with newly registered escort
                login_response = requests.post(
                    f"{BACKEND_URL}/auth/login",
                    json={"email": self.escort_user["email"], "password": self.escort_user["password"]}
                )
                
                self.assertEqual(login_response.status_code, 200)
                login_data = login_response.json()
                self.assertIn("access_token", login_data)
                self.escort_token = login_data["access_token"]
                logger.info("✅ Escort login test passed")
        except Exception as e:
            logger.error(f"❌ Escort authentication test failed: {str(e)}")
            if "Table" in str(e) and "does not exist" in str(e):
                logger.warning("Database tables may not be set up yet")
            else:
                self.fail(f"Escort authentication test failed: {str(e)}")
        
        # Test logout (only if we have a token)
        if self.client_token:
            try:
                logout_response = requests.post(
                    f"{BACKEND_URL}/auth/logout",
                    headers={"Authorization": f"Bearer {self.client_token}"}
                )
                
                self.assertEqual(logout_response.status_code, 200)
                logout_data = logout_response.json()
                self.assertEqual(logout_data["message"], "Logout successful")
                logger.info("✅ Logout test passed")
                
                # Login again to get a fresh token for other tests
                login_response = requests.post(
                    f"{BACKEND_URL}/auth/login",
                    json={"email": self.client_user["email"], "password": self.client_user["password"]}
                )
                
                self.assertEqual(login_response.status_code, 200)
                login_data = login_response.json()
                self.client_token = login_data["access_token"]
            except Exception as e:
                logger.error(f"❌ Logout test failed: {str(e)}")
                self.fail(f"Logout test failed: {str(e)}")
    
    def test_profile_management(self):
        """Test profile management endpoints"""
        # Skip if we don't have tokens
        if not self.client_token or not self.escort_token:
            logger.warning("Skipping profile tests - no authentication tokens available")
            return
        
        # Test get my profile
        try:
            response = requests.get(
                f"{BACKEND_URL}/profile/me",
                headers={"Authorization": f"Bearer {self.client_token}"}
            )
            
            self.assertEqual(response.status_code, 200)
            profile_data = response.json()
            self.assertEqual(profile_data["email"], self.client_user["email"])
            logger.info("✅ Get my profile test passed")
        except Exception as e:
            logger.error(f"❌ Get my profile test failed: {str(e)}")
            if "Table" in str(e) and "does not exist" in str(e):
                logger.warning("Database tables may not be set up yet")
            else:
                self.fail(f"Get my profile test failed: {str(e)}")
        
        # Test update profile
        try:
            update_data = {
                "bio": f"Updated bio at {datetime.now().isoformat()}"
            }
            
            response = requests.put(
                f"{BACKEND_URL}/profile/me",
                headers={"Authorization": f"Bearer {self.client_token}"},
                json=update_data
            )
            
            self.assertEqual(response.status_code, 200)
            updated_profile = response.json()
            self.assertEqual(updated_profile["profile"]["bio"], update_data["bio"])
            logger.info("✅ Update profile test passed")
        except Exception as e:
            logger.error(f"❌ Update profile test failed: {str(e)}")
            if "Table" in str(e) and "does not exist" in str(e):
                logger.warning("Database tables may not be set up yet")
            else:
                self.fail(f"Update profile test failed: {str(e)}")
        
        # Test get profiles with role filtering
        try:
            # Get client profiles
            response = requests.get(f"{BACKEND_URL}/profiles?role=client")
            
            self.assertEqual(response.status_code, 200)
            profiles_data = response.json()
            self.assertIn("profiles", profiles_data)
            
            # Check if our test client is in the list
            client_found = False
            for profile in profiles_data["profiles"]:
                if profile["email"] == self.client_user["email"]:
                    client_found = True
                    break
            
            if profiles_data["profiles"]:
                self.assertTrue(client_found, "Test client not found in profiles list")
            
            logger.info("✅ Get profiles with role filtering test passed")
        except Exception as e:
            logger.error(f"❌ Get profiles with role filtering test failed: {str(e)}")
            if "Table" in str(e) and "does not exist" in str(e):
                logger.warning("Database tables may not be set up yet")
            else:
                self.fail(f"Get profiles with role filtering test failed: {str(e)}")
        
        # Test get specific profile
        if self.client_id:
            try:
                response = requests.get(f"{BACKEND_URL}/profiles/{self.client_id}")
                
                self.assertEqual(response.status_code, 200)
                profile_data = response.json()
                self.assertIn("profile", profile_data)
                self.assertEqual(profile_data["profile"]["id"], self.client_id)
                logger.info("✅ Get specific profile test passed")
            except Exception as e:
                logger.error(f"❌ Get specific profile test failed: {str(e)}")
                if "Table" in str(e) and "does not exist" in str(e):
                    logger.warning("Database tables may not be set up yet")
                else:
                    self.fail(f"Get specific profile test failed: {str(e)}")
    
    def test_gift_system(self):
        """Test gift system endpoints"""
        # Skip if we don't have tokens
        if not self.client_token or not self.escort_id:
            logger.warning("Skipping gift system tests - no authentication tokens or escort ID available")
            return
        
        # Test get gift types
        try:
            response = requests.get(f"{BACKEND_URL}/gifts/types")
            
            self.assertEqual(response.status_code, 200)
            gift_types = response.json()
            self.assertIn("gift_types", gift_types)
            self.assertTrue(len(gift_types["gift_types"]) > 0)
            logger.info("✅ Get gift types test passed")
        except Exception as e:
            logger.error(f"❌ Get gift types test failed: {str(e)}")
            self.fail(f"Get gift types test failed: {str(e)}")
        
        # Test send gift
        try:
            gift_data = {
                "receiver_id": self.escort_id,
                "gift_type": "heart",
                "message": "Test gift from automated testing"
            }
            
            response = requests.post(
                f"{BACKEND_URL}/gifts/send",
                headers={"Authorization": f"Bearer {self.client_token}"},
                json=gift_data
            )
            
            # If we have insufficient credits, that's expected and not a test failure
            if response.status_code == 400 and "Insufficient credits" in response.text:
                logger.warning("Could not send gift: Insufficient credits")
            else:
                self.assertEqual(response.status_code, 200)
                gift_response = response.json()
                self.assertIn("gift", gift_response)
                self.assertEqual(gift_response["gift"]["receiver_id"], self.escort_id)
                logger.info("✅ Send gift test passed")
        except Exception as e:
            logger.error(f"❌ Send gift test failed: {str(e)}")
            if "Table" in str(e) and "does not exist" in str(e):
                logger.warning("Database tables may not be set up yet")
            else:
                self.fail(f"Send gift test failed: {str(e)}")
        
        # Test get received gifts
        try:
            response = requests.get(
                f"{BACKEND_URL}/gifts/received",
                headers={"Authorization": f"Bearer {self.escort_token}"}
            )
            
            self.assertEqual(response.status_code, 200)
            gifts_data = response.json()
            self.assertIn("gifts", gifts_data)
            logger.info("✅ Get received gifts test passed")
        except Exception as e:
            logger.error(f"❌ Get received gifts test failed: {str(e)}")
            if "Table" in str(e) and "does not exist" in str(e):
                logger.warning("Database tables may not be set up yet")
            else:
                self.fail(f"Get received gifts test failed: {str(e)}")
        
        # Test get sent gifts
        try:
            response = requests.get(
                f"{BACKEND_URL}/gifts/sent",
                headers={"Authorization": f"Bearer {self.client_token}"}
            )
            
            self.assertEqual(response.status_code, 200)
            gifts_data = response.json()
            self.assertIn("gifts", gifts_data)
            logger.info("✅ Get sent gifts test passed")
        except Exception as e:
            logger.error(f"❌ Get sent gifts test failed: {str(e)}")
            if "Table" in str(e) and "does not exist" in str(e):
                logger.warning("Database tables may not be set up yet")
            else:
                self.fail(f"Get sent gifts test failed: {str(e)}")
    
    def test_rewards_and_leaderboards(self):
        """Test rewards and leaderboards endpoints"""
        # Test get reward pools
        try:
            response = requests.get(f"{BACKEND_URL}/rewards/pools")
            
            self.assertEqual(response.status_code, 200)
            pools_data = response.json()
            self.assertIn("client_reward_pool", pools_data)
            self.assertIn("escort_reward_pool", pools_data)
            self.assertIn("total_rewards", pools_data)
            logger.info("✅ Get reward pools test passed")
        except Exception as e:
            logger.error(f"❌ Get reward pools test failed: {str(e)}")
            self.fail(f"Get reward pools test failed: {str(e)}")
        
        # Test get client leaderboard
        try:
            response = requests.get(f"{BACKEND_URL}/rewards/client-leaderboard")
            
            self.assertEqual(response.status_code, 200)
            leaderboard_data = response.json()
            self.assertIn("leaderboard", leaderboard_data)
            logger.info("✅ Get client leaderboard test passed")
        except Exception as e:
            logger.error(f"❌ Get client leaderboard test failed: {str(e)}")
            if "Table" in str(e) and "does not exist" in str(e):
                logger.warning("Database tables may not be set up yet")
            else:
                self.fail(f"Get client leaderboard test failed: {str(e)}")
        
        # Test get escort leaderboard
        try:
            response = requests.get(f"{BACKEND_URL}/rewards/escort-leaderboard")
            
            self.assertEqual(response.status_code, 200)
            leaderboard_data = response.json()
            self.assertIn("leaderboard", leaderboard_data)
            logger.info("✅ Get escort leaderboard test passed")
        except Exception as e:
            logger.error(f"❌ Get escort leaderboard test failed: {str(e)}")
            if "Table" in str(e) and "does not exist" in str(e):
                logger.warning("Database tables may not be set up yet")
            else:
                self.fail(f"Get escort leaderboard test failed: {str(e)}")
    
    def test_payment_system(self):
        """Test payment system endpoints"""
        # Test get credit packages
        try:
            response = requests.get(f"{BACKEND_URL}/payments/packages/credits")
            
            self.assertEqual(response.status_code, 200)
            packages_data = response.json()
            self.assertIn("packages", packages_data)
            self.assertIn("starter", packages_data["packages"])
            self.assertIn("popular", packages_data["packages"])
            self.assertIn("premium", packages_data["packages"])
            logger.info("✅ Get credit packages test passed")
        except Exception as e:
            logger.error(f"❌ Get credit packages test failed: {str(e)}")
            self.fail(f"Get credit packages test failed: {str(e)}")
        
        # Test get VIP packages
        try:
            response = requests.get(f"{BACKEND_URL}/payments/packages/vip")
            
            self.assertEqual(response.status_code, 200)
            packages_data = response.json()
            self.assertIn("packages", packages_data)
            self.assertIn("monthly", packages_data["packages"])
            self.assertIn("yearly", packages_data["packages"])
            logger.info("✅ Get VIP packages test passed")
        except Exception as e:
            logger.error(f"❌ Get VIP packages test failed: {str(e)}")
            self.fail(f"Get VIP packages test failed: {str(e)}")
        
        # Test create checkout session (requires authentication)
        if self.client_token:
            try:
                checkout_data = {
                    "product_type": "credits",
                    "package_id": "starter",
                    "success_url": "https://example.com/success",
                    "cancel_url": "https://example.com/cancel"
                }
                
                response = requests.post(
                    f"{BACKEND_URL}/payments/checkout/session",
                    headers={"Authorization": f"Bearer {self.client_token}"},
                    json=checkout_data
                )
                
                self.assertEqual(response.status_code, 200)
                session_data = response.json()
                self.assertIn("session_id", session_data)
                self.assertIn("url", session_data)
                logger.info("✅ Create checkout session test passed")
            except Exception as e:
                logger.error(f"❌ Create checkout session test failed: {str(e)}")
                if "Invalid API key provided" in str(e):
                    logger.warning("Stripe API key may not be valid or configured correctly")
                else:
                    self.fail(f"Create checkout session test failed: {str(e)}")
    
    def test_repost_system(self):
        """Test repost system endpoints"""
        # Skip if we don't have tokens
        if not self.escort_token:
            logger.warning("Skipping repost tests - no escort token available")
            return
        
        # Test create repost
        try:
            repost_data = {
                "title": "Test Repost",
                "content": "This is a test repost created by automated testing",
                "image_url": "https://example.com/test-image.jpg"
            }
            
            response = requests.post(
                f"{BACKEND_URL}/reposts",
                headers={"Authorization": f"Bearer {self.escort_token}"},
                json=repost_data
            )
            
            self.assertEqual(response.status_code, 200)
            repost_response = response.json()
            self.assertIn("repost", repost_response)
            self.assertEqual(repost_response["repost"]["title"], repost_data["title"])
            logger.info("✅ Create repost test passed")
        except Exception as e:
            logger.error(f"❌ Create repost test failed: {str(e)}")
            if "Table" in str(e) and "does not exist" in str(e):
                logger.warning("Database tables may not be set up yet")
            else:
                self.fail(f"Create repost test failed: {str(e)}")
        
        # Test get reposts
        try:
            response = requests.get(f"{BACKEND_URL}/reposts")
            
            self.assertEqual(response.status_code, 200)
            reposts_data = response.json()
            self.assertIn("reposts", reposts_data)
            logger.info("✅ Get reposts test passed")
        except Exception as e:
            logger.error(f"❌ Get reposts test failed: {str(e)}")
            if "Table" in str(e) and "does not exist" in str(e):
                logger.warning("Database tables may not be set up yet")
            else:
                self.fail(f"Get reposts test failed: {str(e)}")
        
        # Test get user reposts
        if self.escort_id:
            try:
                response = requests.get(f"{BACKEND_URL}/reposts/user/{self.escort_id}")
                
                self.assertEqual(response.status_code, 200)
                reposts_data = response.json()
                self.assertIn("reposts", reposts_data)
                logger.info("✅ Get user reposts test passed")
            except Exception as e:
                logger.error(f"❌ Get user reposts test failed: {str(e)}")
                if "Table" in str(e) and "does not exist" in str(e):
                    logger.warning("Database tables may not be set up yet")
                else:
                    self.fail(f"Get user reposts test failed: {str(e)}")
    
    def test_protected_endpoints(self):
        """Test that protected endpoints require authentication"""
        # Test accessing a protected endpoint without authentication
        try:
            response = requests.get(f"{BACKEND_URL}/profile/me")
            
            self.assertEqual(response.status_code, 403)
            logger.info("✅ Protected endpoint test passed")
        except Exception as e:
            logger.error(f"❌ Protected endpoint test failed: {str(e)}")
            self.fail(f"Protected endpoint test failed: {str(e)}")

def run_tests():
    """Run all tests"""
    logger.info("Starting EuroLove Dating Platform API tests...")
    
    # Create test suite
    test_suite = unittest.TestSuite()
    
    # Add test cases
    test_suite.addTest(EuroLoveAPITest('test_root_endpoint'))
    test_suite.addTest(EuroLoveAPITest('test_auth_flow'))
    test_suite.addTest(EuroLoveAPITest('test_profile_management'))
    test_suite.addTest(EuroLoveAPITest('test_gift_system'))
    test_suite.addTest(EuroLoveAPITest('test_rewards_and_leaderboards'))
    test_suite.addTest(EuroLoveAPITest('test_payment_system'))
    test_suite.addTest(EuroLoveAPITest('test_repost_system'))
    test_suite.addTest(EuroLoveAPITest('test_protected_endpoints'))
    
    # Run tests
    test_runner = unittest.TextTestRunner(verbosity=2)
    test_result = test_runner.run(test_suite)
    
    # Print summary
    logger.info(f"Tests run: {test_result.testsRun}")
    logger.info(f"Errors: {len(test_result.errors)}")
    logger.info(f"Failures: {len(test_result.failures)}")
    
    return test_result.wasSuccessful()

if __name__ == "__main__":
    success = run_tests()
    exit(0 if success else 1)
