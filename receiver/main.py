import os
import psycopg2
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()  # reads the .env file into environment variables

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

def get_connection():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
    )

@app.post("/collect")
async def collect(request: Request):
    data = await request.json()

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO pageviews (url, referrer) VALUES (%s, %s)",
        (data.get("url"), data.get("referrer")),
    )
    conn.commit()
    cur.close()
    conn.close()

    return {"status": "ok"}