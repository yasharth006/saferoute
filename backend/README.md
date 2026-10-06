# SafeRoute Backend — Review 1

Express/PostgreSQL API for anonymous incident reports, evidence integrity checks, and admin-managed complaint status.

## Setup

1. Install Node.js 20+ and PostgreSQL 14+.
2. Create an empty database named `saferoute`.
3. Copy `.env.example` to `.env` and set `DATABASE_URL`, `JWT_SECRET`, and the admin credentials.
4. Run `npm install`, `npm run migrate`, `npm run seed`, then `npm start`.

The API runs at `http://localhost:3000`. Uploaded evidence is stored locally in `uploads/`; use managed object storage before production deployment.

## Tests

`npm test` runs endpoint integration tests against an in-memory PostgreSQL-compatible database. No running database is required.

## Typical flow

```sh
# 1. Obtain an anonymous session
curl -X POST http://localhost:3000/auth/reporter-session

# 2. Create a report using its token
curl -X POST http://localhost:3000/complaints -H "Content-Type: application/json" -H "x-reporter-session: SESSION_TOKEN" -d '{"category":"Harassment","description":"Unsafe behaviour at the station after dark.","severity":"high"}'

# 3. Public lookup
curl http://localhost:3000/complaints/SR-TRACKINGID
```

See `docs/openapi.yaml` for the complete contract, including admin login, evidence upload/verification, and status updates.
# SafeRoute Backend

```powershell
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The API reads `ml-service/data/processed/locality_risk_scores.csv` once at startup. Set `SAFEROUTE_RISK_CSV` to override the path and `SAFEROUTE_ALLOWED_ORIGIN` to change the dashboard origin.
