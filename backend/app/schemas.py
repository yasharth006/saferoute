from pydantic import BaseModel, Field, ConfigDict, field_validator

class RiskRecord(BaseModel):
    model_config = ConfigDict(extra="forbid")
    region: str
    location: str
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    historical_spatial_risk_score: float = Field(ge=0, le=1)
    risk_level: str
    cluster: int
    anomaly_score: float
    severity_score: float
    crime_density: float

    @field_validator("risk_level")
    @classmethod
    def valid_level(cls, value):
        if value not in {"LOW", "MEDIUM", "HIGH", "VERY_HIGH"}: raise ValueError("invalid risk level")
        return value

class HealthResponse(BaseModel):
    status: str
    ml_loaded: bool
