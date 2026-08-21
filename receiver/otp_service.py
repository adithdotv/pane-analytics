import hmac
import secrets

from fastapi import HTTPException

from config import (
    OTP_BYPASS_CODE,
    OTP_BYPASS_EMAIL,
    OTP_MAX_ATTEMPTS,
    OTP_RESEND_COOLDOWN_SECONDS,
    OTP_TTL_SECONDS,
)
from redis_client import r

CODE_KEY = "otp:code:{email}"
ATTEMPTS_KEY = "otp:attempts:{email}"
COOLDOWN_KEY = "otp:cooldown:{email}"
BYPASS_ATTEMPTS_KEY = "otp:bypass_attempts:{email}"

BYPASS_MAX_ATTEMPTS = 5
BYPASS_LOCKOUT_SECONDS = 900  # window that failed bypass guesses count against


def generate_and_store_code(email: str) -> str:
    if r.get(COOLDOWN_KEY.format(email=email)):
        raise HTTPException(status_code=429, detail="Please wait before requesting another code")

    code = f"{secrets.randbelow(1_000_000):06d}"
    r.set(CODE_KEY.format(email=email), code, ex=OTP_TTL_SECONDS)
    r.delete(ATTEMPTS_KEY.format(email=email))
    r.set(COOLDOWN_KEY.format(email=email), "1", ex=OTP_RESEND_COOLDOWN_SECONDS)
    return code


def verify_code(email: str, code: str) -> bool:
    """Checks the code and consumes it on success. Invalidates it after too many wrong attempts."""
    stored_code = r.get(CODE_KEY.format(email=email))
    if stored_code is None:
        return False

    if hmac.compare_digest(stored_code, code):
        r.delete(CODE_KEY.format(email=email))
        r.delete(ATTEMPTS_KEY.format(email=email))
        return True

    attempts = r.incr(ATTEMPTS_KEY.format(email=email))
    if attempts >= OTP_MAX_ATTEMPTS:
        r.delete(CODE_KEY.format(email=email))
        r.delete(ATTEMPTS_KEY.format(email=email))

    return False


def is_bypass_code(email: str, code: str) -> bool:
    """Lets OTP_BYPASS_EMAIL log in with the fixed OTP_BYPASS_CODE, rate-limited independently
    of the real flow since it's a long-lived secret rather than a single-use code."""
    if not OTP_BYPASS_EMAIL or not OTP_BYPASS_CODE or email != OTP_BYPASS_EMAIL:
        return False

    attempts_key = BYPASS_ATTEMPTS_KEY.format(email=email)
    if int(r.get(attempts_key) or 0) >= BYPASS_MAX_ATTEMPTS:
        return False

    if hmac.compare_digest(code, OTP_BYPASS_CODE):
        r.delete(attempts_key)
        return True

    r.incr(attempts_key)
    r.expire(attempts_key, BYPASS_LOCKOUT_SECONDS)
    return False
