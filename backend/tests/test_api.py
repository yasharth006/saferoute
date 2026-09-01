from fastapi.testclient import TestClient
from app.main import app

def test_health_and_real_csv():
    with TestClient(app) as client:
        assert client.get("/api/health").json() == {"status": "ok", "ml_loaded": True}
        response = client.get("/api/risk/localities")
        assert response.status_code == 200 and len(response.json()) == 166
        assert response.json()[0]["region"] == "Delhi"

def test_nearby_and_validation():
    with TestClient(app) as client:
        point = client.get("/api/risk/localities").json()[0]
        assert len(client.get("/api/risk/nearby", params={"lat": point["latitude"], "lon": point["longitude"], "radius_km": 1}).json()) >= 1
        assert client.get("/api/risk/nearby", params={"lat": 999, "lon": 77, "radius_km": 1}).status_code == 422
