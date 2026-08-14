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

MAX_PASSWORD_BYTES = 72  # bcrypt silently ignores anything past this
