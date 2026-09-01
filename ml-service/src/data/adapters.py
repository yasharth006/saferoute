import re
import pandas as pd
from .schemas import CANONICAL_COLUMNS

ALIASES = {
    "location": ["location", "nm_pol"], "murder_count": ["murder"], "rape_count": ["rape"],
    "gangrape_count": ["gangrape"], "robbery_count": ["robbery"], "theft_count": ["theft"],
    "assault_count": ["assault_murders", "assualt_murders", "assault"],
    "sexual_harassment_count": ["sexual_harassment", "sexual harassement", "sexual_harassement"],
    "area": ["area", "totarea", "total_area"], "total_crime": ["total_crime", "totalcrime"],
    "longitude": ["longitude", "long"], "latitude": ["latitude", "lat"],
    "crime_density": ["crime/area", "crime_density"],
}

def _key(value: str) -> str:
    return re.sub(r"[^a-z0-9]", "", str(value).lower())

def adapt(df: pd.DataFrame, filename: str, region: str, source_type: str, synthetic: bool) -> pd.DataFrame:
    by_key = {_key(c): c for c in df.columns}
    out = pd.DataFrame(index=df.index)
    out["region"], out["source_file"], out["source_type"], out["is_synthetic"] = region, filename, source_type, synthetic
    for canonical in CANONICAL_COLUMNS:
        if canonical in {"region", "source_file", "source_type", "is_synthetic"}:
            continue
        source = next((by_key[_key(alias)] for alias in ALIASES.get(canonical, [canonical]) if _key(alias) in by_key), None)
        out[canonical] = df[source] if source else pd.NA
    return out[CANONICAL_COLUMNS]
