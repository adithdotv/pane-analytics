import secrets

from fastapi import APIRouter, Depends

from database import get_connection
from security import get_current_user

router = APIRouter(prefix="/sites", tags=["sites"])


@router.get("")
async def list_sites(user_id: int = Depends(get_current_user)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT id, name, site_key FROM sites WHERE user_id = %s ORDER BY created_at",
        (user_id,),
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    return [{"id": row[0], "name": row[1], "site_key": row[2]} for row in rows]


@router.post("")
async def create_site(name: str, user_id: int = Depends(get_current_user)):
    site_key = "pk_" + secrets.token_hex(12)

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO sites (user_id, name, site_key) VALUES (%s, %s, %s) RETURNING id",
        (user_id, name, site_key)
    )
    site_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {"id": site_id, "name": name, "site_key": site_key}
