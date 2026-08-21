from pydantic import BaseModel, EmailStr, field_validator


class PageviewEvent(BaseModel):
    site_key: str
    url: str
    referrer: str = "direct"


class RequestOtpRequest(BaseModel):
    email: EmailStr


class VerifyOtpRequest(BaseModel):
    email: EmailStr
    code: str

    @field_validator("code")
    @classmethod
    def check_code_format(cls, value: str) -> str:
        if not value.isdigit() or len(value) != 6:
            raise ValueError("Code must be 6 digits")
        return value
