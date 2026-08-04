import os
import psycopg2
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import redis
import json

load_dotenv()  # reads the .env file into environment variables

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

r = redis.Redis(host="127.0.0.1", port=6379, decode_responses=True)

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

    event = {
        "url": data.get("url"),
        "referrer": data.get("referrer"),
    }
    r.lpush("pageview_queue", json.dumps(event))

    return {"status": "ok"}
    

@app.get("/stats/top-pages")
async def top_pages():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT url, COUNT(*) as visits
        FROM pageviews
        GROUP BY url
        ORDER BY visits DESC
        LIMIT 10
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    return [{"url": row[0], "visits": row[1]} for row in rows]


@app.get("/stats/top-referrers")
async def top_referrers():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT referrer, COUNT(*) as visits
        FROM pageviews
        GROUP BY referrer
        ORDER BY visits DESC
        LIMIT 10
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    return [{"referrer": row[0], "visits": row[1]} for row in rows]

@app.get("/stats/visits-over-time")
async def visits_over_time():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT DATE(created_at) as day, COUNT(*) as visits
        FROM pageviews
        GROUP BY day
        ORDER BY day ASC
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    return [{"day": str(row[0]), "visits": row[1]} for row in rows]