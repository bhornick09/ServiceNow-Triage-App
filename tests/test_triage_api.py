import os
import requests
import pytest

INSTANCE = os.environ["SN_INSTANCE"]    # e.g. dev12345
USER = os.environ["SN_USER"]
PASSWORD = os.environ["SN_PASSWORD"]
USER_SYS_ID = os.environ["SN_TEST_USER_SYS_ID"]
SCOPE = "x_1910001_triage_0"

URL = f"https://{INSTANCE}.service-now.com/api/{SCOPE}/triage/open-count/{USER_SYS_ID}"

def get_count():
    r = requests.get(URL, auth=(USER, PASSWORD), timeout=30)
    return r

def test_endpoint_returns_200():
    r = get_count()
    assert r.status_code == 200

def test_response_contains_expected_fields():
    body = get_count().json()["result"]
    assert "open_incidents" in body
    assert isinstance(body["open_incidents"], int)
    assert body["open_incidents"] >= 0

def test_unknown_user_returns_404():
    bad = requests.get(
        URL.replace(USER_SYS_ID, "0" * 32),
        auth=(USER, PASSWORD), timeout=30
    )
    assert bad.status_code == 404