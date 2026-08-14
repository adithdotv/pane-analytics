import psycopg2
from fastapi import APIRouter, HTTPException

from database import get_connection
from models import LoginRequest, SignupRequest
from security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup")
async def signup(data: SignupRequest):
    hashed = hash_password(data.password)

    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO users (email, hashed_password) VALUES (%s, %s) RETURNING id",
            (data.email, hashed)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        raise HTTPException(status_code=400, detail="Email already registered")
    finally:
        cur.close()
        conn.close()

    return {"id": user_id, "email": data.email}


@router.post("/login")
async def login(data: LoginRequest):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, hashed_password FROM users WHERE email = %s", (data.email,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row or not verify_password(data.password, row[1]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(user_id=row[0])
    return {"access_token": token}
