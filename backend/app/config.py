from pathlib import Path
import os

ROOT = Path(__file__).resolve().parents[2]
RISK_CSV = Path(os.getenv("SAFEROUTE_RISK_CSV", ROOT / "ml-service/data/processed/locality_risk_scores.csv"))
ALLOWED_ORIGIN = os.getenv("SAFEROUTE_ALLOWED_ORIGIN", "http://localhost:3000")
