import pytest

from database import get_connection
from security import create_access_token


@pytest.fixture(autouse=True)
def clean_pageviews():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM pageviews")
    conn.commit()
    cur.close()
    conn.close()


def insert_pageview(url, referrer, site_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO pageviews (url, referrer, site_id) VALUES (%s, %s, %s)",
        (url, referrer, site_id),
    )
    conn.commit()
    cur.close()
    conn.close()


def test_top_pages_counts_correctly(client, site):
    insert_pageview("https://a.com", "direct", site["id"])
    insert_pageview("https://a.com", "direct", site["id"])
    insert_pageview("https://b.com", "direct", site["id"])

    token = create_access_token(user_id=site["user_id"])
    response = client.get(
        "/stats/top-pages",
        params={"site_id": site["id"]},
        headers={"Authorization": f"Bearer {token}"},
    )
    data = response.json()

    assert data[0]["url"] == "https://a.com"
    assert data[0]["visits"] == 2


def test_top_pages_rejects_other_users_site(client, site):
    insert_pageview("https://a.com", "direct", site["id"])

    other_users_token = create_access_token(user_id=site["user_id"] + 1)
    response = client.get(
        "/stats/top-pages",
        params={"site_id": site["id"]},
        headers={"Authorization": f"Bearer {other_users_token}"},
    )

    assert response.status_code == 403
