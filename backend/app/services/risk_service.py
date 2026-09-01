import csv
import math
from pathlib import Path
from ..schemas import RiskRecord

def _distance_km(lat1, lon1, lat2, lon2):
    radius = 6371.0088
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = math.radians(lat2-lat1), math.radians(lon2-lon1)
    a = math.sin(dp/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2 * radius * math.asin(math.sqrt(a))

class RiskService:
    def __init__(self, path: Path):
        with path.open(newline="", encoding="utf-8") as f:
            self.records = [RiskRecord.model_validate(row) for row in csv.DictReader(f) if row["region"] == "Delhi"]
    def nearby(self, lat, lon, radius_km):
        return [r for r in self.records if _distance_km(lat, lon, r.latitude, r.longitude) <= radius_km]
