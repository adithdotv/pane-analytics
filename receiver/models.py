from pydantic import BaseModel, EmailStr, field_validator

from config import MAX_PASSWORD_BYTES


def validate_password_length(value: str) -> str:
    if len(value.encode("utf-8")) > MAX_PASSWORD_BYTES:
        raise ValueError(f"Password must be at most {MAX_PASSWORD_BYTES} bytes")
    return value


class PageviewEvent(BaseModel):
    site_key: str
    url: str
    referrer: str = "direct"


class SignupRequest(BaseModel):
    email: EmailStr
    password: str

    _check_password_length = field_validator("password")(validate_password_length)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    _check_password_length = field_validator("password")(validate_password_length)
