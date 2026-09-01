# SafeRoute Backend

```powershell
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The API reads `ml-service/data/processed/locality_risk_scores.csv` once at startup. Set `SAFEROUTE_RISK_CSV` to override the path and `SAFEROUTE_ALLOWED_ORIGIN` to change the dashboard origin.
