import json

from fastapi import APIRouter, HTTPException

from database import get_connection
from models import PageviewEvent
from redis_client import r

router = APIRouter(tags=["collect"])


@router.post("/collect")
async def collect(event: PageviewEvent):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM sites WHERE site_key = %s", (event.site_key,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Unknown site")

    site_id = row[0]
    r.lpush("pageview_queue", json.dumps({
        "site_id": site_id,
        "url": event.url,
        "referrer": event.referrer
    }))
    return {"status": "ok"}
