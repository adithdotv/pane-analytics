from datetime import datetime, timedelta

from fastapi import HTTPException, Request
from jose import jwt

from config import ACCESS_TOKEN_TTL_DAYS, COOKIE_NAME, JWT_ALGORITHM, JWT_SECRET


def create_access_token(user_id: int) -> str:
    payload = {"user_id": user_id, "exp": datetime.utcnow() + timedelta(days=ACCESS_TOKEN_TTL_DAYS)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def get_current_user(request: Request) -> int:
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Not logged in")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload["user_id"]
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
