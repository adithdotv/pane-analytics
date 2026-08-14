from fastapi import APIRouter, Depends, HTTPException

from database import get_connection
from security import get_current_user

router = APIRouter(prefix="/stats", tags=["stats"])


def ensure_site_ownership(cur, site_id: int, user_id: int) -> None:
    cur.execute("SELECT id FROM sites WHERE id = %s AND user_id = %s", (site_id, user_id))
    if not cur.fetchone():
        raise HTTPException(status_code=403, detail="Not your site")


@router.get("/top-pages")
async def top_pages(site_id: int, user_id: int = Depends(get_current_user)):
    conn = get_connection()
    cur = conn.cursor()
    try:
        ensure_site_ownership(cur, site_id, user_id)

        cur.execute("""
            SELECT url, COUNT(*) as visits
            FROM pageviews
            WHERE site_id = %s
            GROUP BY url
            ORDER BY visits DESC
            LIMIT 10
        """, (site_id,))
        rows = cur.fetchall()
    finally:
        cur.close()
        conn.close()

    return [{"url": row[0], "visits": row[1]} for row in rows]


@router.get("/top-referrers")
async def top_referrers(site_id: int, user_id: int = Depends(get_current_user)):
    conn = get_connection()
    cur = conn.cursor()
    try:
        ensure_site_ownership(cur, site_id, user_id)

        cur.execute("""
            SELECT referrer, COUNT(*) as visits
            FROM pageviews
            WHERE site_id = %s
            GROUP BY referrer
            ORDER BY visits DESC
            LIMIT 10
        """, (site_id,))
        rows = cur.fetchall()
    finally:
        cur.close()
        conn.close()

    return [{"referrer": row[0], "visits": row[1]} for row in rows]


@router.get("/visits-over-time")
async def visits_over_time(site_id: int, user_id: int = Depends(get_current_user)):
    conn = get_connection()
    cur = conn.cursor()
    try:
        ensure_site_ownership(cur, site_id, user_id)

        cur.execute("""
            SELECT DATE(created_at) as day, COUNT(*) as visits
            FROM pageviews
            WHERE site_id = %s
            GROUP BY day
            ORDER BY day ASC
        """, (site_id,))
        rows = cur.fetchall()
    finally:
        cur.close()
        conn.close()

    return [{"day": str(row[0]), "visits": row[1]} for row in rows]
