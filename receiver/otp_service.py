import hmac
import secrets

from fastapi import HTTPException

from config import OTP_MAX_ATTEMPTS, OTP_RESEND_COOLDOWN_SECONDS, OTP_TTL_SECONDS
from redis_client import r

CODE_KEY = "otp:code:{email}"
ATTEMPTS_KEY = "otp:attempts:{email}"
COOLDOWN_KEY = "otp:cooldown:{email}"


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
