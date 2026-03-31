import requests
import sys
from datetime import datetime
import json

class QuasarAppsAPITester:
    def __init__(self, base_url="https://quantum-ui-3.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else self.api_url
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_data": None,
                "error": None
            }

            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    result["response_data"] = response.json()
                    if isinstance(result["response_data"], list):
                        print(f"   Response: List with {len(result['response_data'])} items")
                    elif isinstance(result["response_data"], dict):
                        print(f"   Response keys: {list(result['response_data'].keys())}")
                except:
                    result["response_data"] = response.text
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    result["error"] = response.json()
                except:
                    result["error"] = response.text
                print(f"   Error: {result['error']}")

            self.test_results.append(result)
            return success, result.get("response_data", {})

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": None,
                "success": False,
                "response_data": None,
                "error": str(e)
            }
            self.test_results.append(result)
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_get_case_studies(self):
        """Test getting all case studies"""
        success, response = self.run_test("Get All Case Studies", "GET", "case-studies", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} case studies")
            if len(response) > 0:
                print(f"   First case study: {response[0].get('title', 'No title')}")
        return success, response

    def test_get_case_study_by_slug(self, slug="fintech-revolution"):
        """Test getting a specific case study by slug"""
        success, response = self.run_test(
            f"Get Case Study by Slug ({slug})", 
            "GET", 
            f"case-studies/{slug}", 
            200
        )
        if success:
            print(f"   Case study title: {response.get('title', 'No title')}")
            print(f"   Client: {response.get('client', 'No client')}")
        return success, response

    def test_get_invalid_case_study(self):
        """Test getting a non-existent case study"""
        return self.run_test(
            "Get Invalid Case Study", 
            "GET", 
            "case-studies/non-existent-slug", 
            404
        )

    def test_submit_contact_form(self):
        """Test submitting contact form"""
        test_data = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": "test@example.com",
            "company": "Test Company",
            "message": "This is a test message from the API tester."
        }
        
        success, response = self.run_test(
            "Submit Contact Form", 
            "POST", 
            "contact", 
            200,
            data=test_data
        )
        if success:
            print(f"   Contact ID: {response.get('id', 'No ID')}")
            print(f"   Name: {response.get('name', 'No name')}")
        return success, response

    def test_get_contact_messages(self):
        """Test getting contact messages"""
        success, response = self.run_test("Get Contact Messages", "GET", "contact", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} contact messages")
        return success, response

    def test_status_endpoints(self):
        """Test status check endpoints"""
        # Test creating status check
        test_data = {
            "client_name": f"Test Client {datetime.now().strftime('%H%M%S')}"
        }
        
        success1, response1 = self.run_test(
            "Create Status Check", 
            "POST", 
            "status", 
            200,
            data=test_data
        )
        
        # Test getting status checks
        success2, response2 = self.run_test("Get Status Checks", "GET", "status", 200)
        
        return success1 and success2

def main():
    print("🚀 Starting Quasar Apps API Testing...")
    print("=" * 60)
    
    tester = QuasarAppsAPITester()
    
    # Run all tests
    print("\n📡 Testing API Endpoints...")
    
    # Basic API tests
    tester.test_root_endpoint()
    
    # Case studies tests
    case_studies_success, case_studies = tester.test_get_case_studies()
    if case_studies_success and len(case_studies) > 0:
        # Test first case study slug
        first_slug = case_studies[0].get('slug')
        if first_slug:
            tester.test_get_case_study_by_slug(first_slug)
    
    tester.test_get_invalid_case_study()
    
    # Contact form tests
    tester.test_submit_contact_form()
    tester.test_get_contact_messages()
    
    # Status check tests
    tester.test_status_endpoints()
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed!")
        
        # Print failed tests
        failed_tests = [t for t in tester.test_results if not t["success"]]
        if failed_tests:
            print("\n🔍 Failed Tests:")
            for test in failed_tests:
                print(f"   - {test['test_name']}: {test.get('error', 'Unknown error')}")
        
        return 1

if __name__ == "__main__":
    sys.exit(main())