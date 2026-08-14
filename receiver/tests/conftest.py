import os

os.environ["DB_NAME"] = "pane_analytics_test"

import pytest
from fastapi.testclient import TestClient

from database import get_connection
from main import app
from security import hash_password


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def site():
    """Creates a user and a site owned by them; yields {id, site_key, user_id}."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO users (email, hashed_password) VALUES (%s, %s) RETURNING id",
        ("test-user@example.com", hash_password("irrelevant")),
    )
    user_id = cur.fetchone()[0]
    cur.execute(
        "INSERT INTO sites (user_id, name, site_key) VALUES (%s, %s, %s) RETURNING id, site_key",
        (user_id, "Test Site", "pk_test_key"),
    )
    site_id, site_key = cur.fetchone()
    conn.commit()

    yield {"id": site_id, "site_key": site_key, "user_id": user_id}

    cur.execute("DELETE FROM pageviews WHERE site_id = %s", (site_id,))
    cur.execute("DELETE FROM sites WHERE id = %s", (site_id,))
    cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
    conn.commit()
    cur.close()
    conn.close()
