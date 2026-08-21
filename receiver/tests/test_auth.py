import pytest

import otp_service
from config import COOKIE_NAME
from database import get_connection
from otp_service import ATTEMPTS_KEY, BYPASS_ATTEMPTS_KEY, CODE_KEY, COOLDOWN_KEY
from redis_client import r

TEST_EMAIL_DOMAIN = "@otp-test.example"


def _get_code(email):
    return r.get(CODE_KEY.format(email=email))


def _clear_otp_state():
    for pattern in (CODE_KEY, ATTEMPTS_KEY, COOLDOWN_KEY):
        keys = r.keys(pattern.format(email=f"*{TEST_EMAIL_DOMAIN}"))
        if keys:
            r.delete(*keys)


def _clear_test_users():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM users WHERE email LIKE %s", (f"%{TEST_EMAIL_DOMAIN}",))
    conn.commit()
    cur.close()
    conn.close()


@pytest.fixture(autouse=True)
def clean_test_users():
    _clear_otp_state()
    _clear_test_users()

    yield

    _clear_otp_state()
    _clear_test_users()


def test_request_otp_stores_a_code(client):
    email = "request@otp-test.example"
    response = client.post("/auth/request-otp", json={"email": email})

    assert response.status_code == 200
    assert _get_code(email) is not None


def test_request_otp_enforces_cooldown(client):
    email = "cooldown@otp-test.example"
    client.post("/auth/request-otp", json={"email": email})

    response = client.post("/auth/request-otp", json={"email": email})

    assert response.status_code == 429


def test_verify_otp_creates_user_and_sets_cookie(client):
    email = "new-user@otp-test.example"
    client.post("/auth/request-otp", json={"email": email})
    code = _get_code(email)

    response = client.post("/auth/verify-otp", json={"email": email, "code": code})

    assert response.status_code == 200
    assert response.json() == {"email": email}
    assert COOKIE_NAME in response.cookies


def test_verify_otp_rejects_wrong_code(client):
    email = "wrong-code@otp-test.example"
    client.post("/auth/request-otp", json={"email": email})
    code = _get_code(email)
    wrong_code = "000000" if code != "000000" else "111111"

    response = client.post("/auth/verify-otp", json={"email": email, "code": wrong_code})

    assert response.status_code == 401


def test_verify_otp_locks_out_after_max_attempts(client):
    email = "lockout@otp-test.example"
    client.post("/auth/request-otp", json={"email": email})
    code = _get_code(email)
    wrong_code = "000000" if code != "000000" else "111111"

    for _ in range(5):
        client.post("/auth/verify-otp", json={"email": email, "code": wrong_code})

    response = client.post("/auth/verify-otp", json={"email": email, "code": code})
    assert response.status_code == 401


def test_me_returns_current_user(client):
    email = "me-user@otp-test.example"
    client.post("/auth/request-otp", json={"email": email})
    code = _get_code(email)
    verify_response = client.post("/auth/verify-otp", json={"email": email, "code": code})
    token = verify_response.cookies[COOKIE_NAME]

    response = client.get("/auth/me", cookies={COOKIE_NAME: token})

    assert response.status_code == 200
    assert response.json()["email"] == email


def test_me_requires_auth(client):
    response = client.get("/auth/me")
    assert response.status_code == 401


def test_bypass_code_logs_in_configured_email(client, monkeypatch):
    email = "bypass@otp-test.example"
    monkeypatch.setattr(otp_service, "OTP_BYPASS_EMAIL", email)
    monkeypatch.setattr(otp_service, "OTP_BYPASS_CODE", "123123")
    r.delete(BYPASS_ATTEMPTS_KEY.format(email=email))

    response = client.post("/auth/verify-otp", json={"email": email, "code": "123123"})

    assert response.status_code == 200
    assert COOKIE_NAME in response.cookies


def test_bypass_code_does_not_work_for_other_emails(client, monkeypatch):
    monkeypatch.setattr(otp_service, "OTP_BYPASS_EMAIL", "bypass-owner@otp-test.example")
    monkeypatch.setattr(otp_service, "OTP_BYPASS_CODE", "123123")

    response = client.post(
        "/auth/verify-otp", json={"email": "someone-else@otp-test.example", "code": "123123"}
    )

    assert response.status_code == 401


def test_bypass_code_locks_out_after_max_attempts(client, monkeypatch):
    email = "bypass-lockout@otp-test.example"
    monkeypatch.setattr(otp_service, "OTP_BYPASS_EMAIL", email)
    monkeypatch.setattr(otp_service, "OTP_BYPASS_CODE", "123123")
    r.delete(BYPASS_ATTEMPTS_KEY.format(email=email))

    for _ in range(5):
        client.post("/auth/verify-otp", json={"email": email, "code": "000000"})

    response = client.post("/auth/verify-otp", json={"email": email, "code": "123123"})
    assert response.status_code == 401
    r.delete(BYPASS_ATTEMPTS_KEY.format(email=email))


def test_logout_clears_cookie(client):
    email = "logout@otp-test.example"
    client.post("/auth/request-otp", json={"email": email})
    code = _get_code(email)
    verify_response = client.post("/auth/verify-otp", json={"email": email, "code": code})
    token = verify_response.cookies[COOKIE_NAME]

    response = client.post("/auth/logout", cookies={COOKIE_NAME: token})

    assert response.status_code == 200
    assert response.cookies.get(COOKIE_NAME) in (None, "", '""')
