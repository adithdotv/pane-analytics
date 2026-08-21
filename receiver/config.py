import os

from dotenv import load_dotenv

load_dotenv()  # reads the .env file into environment variables

DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_TTL_DAYS = 30

OTP_TTL_SECONDS = 300  # how long a code stays valid
OTP_RESEND_COOLDOWN_SECONDS = 60  # minimum gap between two codes for the same email
OTP_MAX_ATTEMPTS = 5  # wrong guesses allowed before a code is invalidated

OTP_BYPASS_EMAIL = os.getenv("OTP_BYPASS_EMAIL")
OTP_BYPASS_CODE = os.getenv("OTP_BYPASS_CODE")

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_FROM = os.getenv("SMTP_FROM", "Pane Analytics <noreply@pane-analytics.in>")

COOKIE_NAME = "pane_token"
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "true").lower() == "true"
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "https://pane-analytics.in,http://localhost:3000").split(",")
]
