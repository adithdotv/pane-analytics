def test_collect_accepts_valid_pageview(client):
    response = client.post("/collect", json={
        "url": "https://example.com",
        "referrer": "direct"
    })
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_collect_rejects_missing_url(client):
    response = client.post("/collect", json={"referrer": "direct"})
    assert response.status_code == 422
