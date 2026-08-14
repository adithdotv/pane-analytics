import json
import time

import psycopg2

from database import create_tables, get_connection
from redis_client import r

BATCH_SIZE = 500


def process_batch(batch, cur):
    try:
        cur.executemany(
            "INSERT INTO pageviews (site_id, url, referrer) VALUES (%s, %s, %s)",
            [(event.get("site_id"), event.get("url"), event.get("referrer")) for event in batch],
        )
    except psycopg2.Error:
        cur.connection.rollback()
        insert_events_individually(batch, cur)


# Falls back to one insert per event so a single malformed event can't discard the whole batch.
def insert_events_individually(batch, cur):
    for event in batch:
        try:
            cur.execute(
                "INSERT INTO pageviews (site_id, url, referrer) VALUES (%s, %s, %s)",
                (event.get("site_id"), event.get("url"), event.get("referrer")),
            )
            cur.connection.commit()
        except psycopg2.Error as error:
            cur.connection.rollback()
            print(f"Skipping malformed pageview event {event!r}: {error}")


def run_worker():
    create_tables()
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
            process_batch(batch, cur)
            conn.commit()
            cur.close()
            conn.close()
            print(f"Inserted batch of {len(batch)} pageviews")

        time.sleep(2)  # wait a bit before checking the queue again


if __name__ == "__main__":
    run_worker()
