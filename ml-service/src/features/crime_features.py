from pathlib import Path
import numpy as np
import pandas as pd
import yaml

COUNT_COLUMNS = ["murder_count", "rape_count", "gangrape_count", "robbery_count", "theft_count", "assault_count", "sexual_harassment_count"]

def load_weights(path: Path) -> dict[str, float]:
    return {k: float(v) for k, v in yaml.safe_load(path.read_text(encoding="utf-8")).items()}

def build_crime_features(df: pd.DataFrame, weights: dict[str, float]) -> pd.DataFrame:
    out = df.copy()
    for c in COUNT_COLUMNS:
        out[f"log_{c}"] = np.log1p(pd.to_numeric(out[c], errors="coerce").clip(lower=0))
        out[f"{c}_per_area"] = pd.to_numeric(out[c], errors="coerce") / out["area"].replace(0, np.nan)
    total = out[COUNT_COLUMNS].sum(axis=1).replace(0, np.nan)
    for c in COUNT_COLUMNS:
        out[f"{c}_ratio"] = out[c] / total
    out["severity_score"] = sum(out[c] * weights.get(c, 1.0) for c in COUNT_COLUMNS)
    out["log_severity_score"] = np.log1p(out["severity_score"].clip(lower=0))
    return out.replace([np.inf, -np.inf], np.nan)

def model_columns(df: pd.DataFrame) -> list[str]:
    excluded = {"region", "location", "source_file", "source_type", "is_synthetic", "severity_score", "crime_density"}
    return [c for c in df.select_dtypes(include="number").columns if c not in excluded]
