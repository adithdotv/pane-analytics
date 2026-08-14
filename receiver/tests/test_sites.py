from security import create_access_token


def test_list_sites_returns_owned_sites(client, site):
    token = create_access_token(user_id=site["user_id"])
    response = client.get("/sites", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == site["id"]
    assert data[0]["site_key"] == site["site_key"]


def test_list_sites_requires_auth(client):
    response = client.get("/sites")
    assert response.status_code == 422
