import pytest

from main import get_connection


@pytest.fixture(autouse=True)
def clean_pageviews():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM pageviews")
    conn.commit()
    cur.close()
    conn.close()


def test_top_pages_counts_correctly(client):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO pageviews (url, referrer) VALUES (%s, %s)", ("https://a.com", "direct"))
    cur.execute("INSERT INTO pageviews (url, referrer) VALUES (%s, %s)", ("https://a.com", "direct"))
    cur.execute("INSERT INTO pageviews (url, referrer) VALUES (%s, %s)", ("https://b.com", "direct"))
    conn.commit()
    cur.close()
    conn.close()

    response = client.get("/stats/top-pages")
    data = response.json()

    assert data[0]["url"] == "https://a.com"
    assert data[0]["visits"] == 2
