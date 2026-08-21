import json

from fastapi import APIRouter, HTTPException, Request
from pydantic import ValidationError

from database import get_connection
from models import PageviewEvent
from redis_client import r

router = APIRouter(tags=["collect"])


@router.post("/collect")
async def collect(request: Request):
    # Parsed manually (not via a PageviewEvent parameter) because the tracker sends this as a
    # CORS-simple request with Content-Type: text/plain to dodge preflight on third-party sites —
    # FastAPI's automatic body parsing only kicks in for application/json.
    try:
        event = PageviewEvent.model_validate_json(await request.body())
    except ValidationError as error:
        raise HTTPException(status_code=422, detail=error.errors())

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
