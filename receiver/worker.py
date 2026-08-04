import os
import time
import json
import redis
import psycopg2
from dotenv import load_dotenv

load_dotenv()

r = redis.Redis(host="127.0.0.1", port=6379, decode_responses=True)

def get_connection():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
    )

BATCH_SIZE = 500

def run_worker():
    print("Worker started, watching queue...")
    while True:
        batch = []

        for _ in range(BATCH_SIZE):
            item = r.rpop("pageview_queue")
            if item is None:
                break
            batch.append(json.loads(item))

        if batch:
            conn = get_connection()
            cur = conn.cursor()
            cur.executemany(
                "INSERT INTO pageviews (url, referrer) VALUES (%s, %s)",
                [(event["url"], event["referrer"]) for event in batch],
            )
            conn.commit()
            cur.close()
            conn.close()
            print(f"Inserted batch of {len(batch)} pageviews")

        time.sleep(2)  # wait a bit before checking the queue again

if __name__ == "__main__":
    run_worker()