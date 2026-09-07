from contextlib import asynccontextmanager
from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from .config import ALLOWED_ORIGIN, RISK_CSV
from .schemas import HealthResponse, RiskRecord
from .services.risk_service import RiskService

@asynccontextmanager
async def lifespan(app):
    app.state.risk_service = RiskService(RISK_CSV)
    yield

app = FastAPI(title="SafeRoute Risk API", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=[ALLOWED_ORIGIN], allow_credentials=True, allow_methods=["GET"], allow_headers=["*"])

@app.get("/api/health", response_model=HealthResponse)
def health(request: Request):
    return {"status": "ok", "ml_loaded": bool(getattr(request.app.state, "risk_service", None))}

@app.get("/api/risk/localities", response_model=list[RiskRecord])
def localities(request: Request):
    return request.app.state.risk_service.records

@app.get("/api/risk/nearby", response_model=list[RiskRecord])
def nearby(request: Request, lat: float = Query(..., ge=-90, le=90), lon: float = Query(..., ge=-180, le=180), radius_km: float = Query(..., gt=0)):
    return request.app.state.risk_service.nearby(lat, lon, radius_km)
