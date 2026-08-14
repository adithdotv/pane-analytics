def test_collect_accepts_valid_pageview(client, site):
    response = client.post("/collect", json={
        "site_key": site["site_key"],
        "url": "https://example.com",
        "referrer": "direct"
    })
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_collect_rejects_missing_url(client, site):
    response = client.post("/collect", json={"site_key": site["site_key"], "referrer": "direct"})
    assert response.status_code == 422


def test_collect_rejects_unknown_site_key(client):
    response = client.post("/collect", json={"site_key": "pk_does_not_exist", "url": "https://example.com"})
    assert response.status_code == 404
