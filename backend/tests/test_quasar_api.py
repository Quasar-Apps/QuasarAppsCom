"""Backend API tests for Quasar Apps - case studies, contact form, status checks.

These are integration tests that exercise a LIVE backend over HTTP. Set
REACT_APP_BACKEND_URL to the target server to run them; otherwise the whole
module is skipped so a bare ``pytest`` run never silently hits a shared remote
deployment (or fails when offline).
"""
import os
import uuid

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
API_URL = f"{BASE_URL}/api"

# Skip the entire module unless an explicit backend URL is provided.
pytestmark = pytest.mark.skipif(
    not BASE_URL,
    reason="Set REACT_APP_BACKEND_URL to run the live backend integration tests.",
)


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---- Root ----
class TestRoot:
    def test_root_returns_message(self, api_client):
        r = api_client.get(f"{API_URL}/", timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert "message" in data
        assert "Quasar" in data["message"]


# ---- Case Studies ----
class TestCaseStudies:
    def test_get_all_case_studies(self, api_client):
        r = api_client.get(f"{API_URL}/case-studies", timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        slugs = [cs["slug"] for cs in data]
        assert "mycsa-app" in slugs

    def test_get_case_study_by_slug(self, api_client):
        r = api_client.get(f"{API_URL}/case-studies/mycsa-app", timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert data["slug"] == "mycsa-app"
        assert data["title"] == "myCSA.app"
        assert data["client"] == "myCSA"
        assert isinstance(data["services"], list) and len(data["services"]) > 0
        assert isinstance(data["results"], list) and len(data["results"]) > 0
        assert isinstance(data["technologies"], list) and len(data["technologies"]) > 0
        # Ensure no mongo _id leaked
        assert "_id" not in data

    def test_get_invalid_case_study_returns_404(self, api_client):
        r = api_client.get(f"{API_URL}/case-studies/non-existent-slug", timeout=10)
        assert r.status_code == 404


# ---- Contact Form ----
class TestContact:
    def test_submit_contact_valid(self, api_client):
        payload = {
            "name": f"TEST_User_{uuid.uuid4().hex[:8]}",
            "email": "test@example.com",
            "company": "TEST_Company",
            "message": "This is a TEST_ pytest message.",
        }
        r = api_client.post(f"{API_URL}/contact", json=payload, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["company"] == payload["company"]
        assert data["message"] == payload["message"]
        assert "id" in data and isinstance(data["id"], str)
        assert "created_at" in data

    def test_submit_contact_without_company(self, api_client):
        payload = {
            "name": "TEST_NoCompany",
            "email": "nocompany@example.com",
            "message": "TEST_ message without company",
        }
        r = api_client.post(f"{API_URL}/contact", json=payload, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["company"] is None

    def test_submit_contact_invalid_email(self, api_client):
        payload = {
            "name": "TEST_BadEmail",
            "email": "not-an-email",
            "message": "TEST_ invalid email",
        }
        r = api_client.post(f"{API_URL}/contact", json=payload, timeout=10)
        assert r.status_code == 422

    def test_submit_contact_missing_required(self, api_client):
        payload = {"email": "test@example.com"}
        r = api_client.post(f"{API_URL}/contact", json=payload, timeout=10)
        assert r.status_code == 422

    def test_submit_contact_message_too_long_returns_422(self, api_client):
        payload = {
            "name": "TEST_Long",
            "email": "long@example.com",
            "message": "x" * 5001,  # exceeds the 5000-char cap
        }
        r = api_client.post(f"{API_URL}/contact", json=payload, timeout=10)
        assert r.status_code == 422

    def test_submit_contact_honeypot_silently_dropped(self, api_client):
        # A populated honeypot ("website") is accepted but not stored/emailed.
        payload = {
            "name": "TEST_Bot",
            "email": "bot@example.com",
            "message": "spam",
            "hp_field": "http://spam.example",
        }
        r = api_client.post(f"{API_URL}/contact", json=payload, timeout=10)
        assert r.status_code == 200

    def test_contact_list_endpoint_removed(self, api_client):
        # The public PII read endpoint was removed; only POST remains.
        r = api_client.get(f"{API_URL}/contact", timeout=10)
        assert r.status_code in (404, 405)


# ---- Status (removed in Phase 0 security hardening) ----
class TestStatusRemoved:
    def test_status_endpoints_removed(self, api_client):
        assert api_client.get(f"{API_URL}/status", timeout=10).status_code == 404
        assert api_client.post(
            f"{API_URL}/status", json={"client_name": "x"}, timeout=10
        ).status_code == 404
