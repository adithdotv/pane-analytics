from fastapi import APIRouter, Depends, HTTPException, Response

from config import ACCESS_TOKEN_TTL_DAYS, COOKIE_NAME, COOKIE_SECURE
from database import get_connection
from email_service import send_otp_email
from models import RequestOtpRequest, VerifyOtpRequest
from otp_service import generate_and_store_code, is_bypass_code, verify_code
from security import create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

COOKIE_MAX_AGE = ACCESS_TOKEN_TTL_DAYS * 24 * 60 * 60


@router.post("/request-otp")
async def request_otp(data: RequestOtpRequest):
    code = generate_and_store_code(data.email)
    send_otp_email(data.email, code)
    return {"message": "Code sent"}


@router.post("/verify-otp")
async def verify_otp(data: VerifyOtpRequest, response: Response):
    if not (is_bypass_code(data.email, data.code) or verify_code(data.email, data.code)):
        raise HTTPException(status_code=401, detail="Invalid or expired code")

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE email = %s", (data.email,))
    row = cur.fetchone()

    if row:
        user_id = row[0]
        cur.execute("UPDATE users SET last_login_at = NOW() WHERE id = %s", (user_id,))
    else:
        cur.execute(
            "INSERT INTO users (email, email_verified_at, last_login_at) VALUES (%s, NOW(), NOW()) RETURNING id",
            (data.email,),
        )
        user_id = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    token = create_access_token(user_id=user_id)
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=COOKIE_MAX_AGE,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        path="/",
    )
    return {"email": data.email}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key=COOKIE_NAME, path="/")
    return {"message": "Logged out"}


@router.get("/me")
async def me(user_id: int = Depends(get_current_user)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT email FROM users WHERE id = %s", (user_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        raise HTTPException(status_code=401, detail="Not logged in")

    return {"id": user_id, "email": row[0]}
