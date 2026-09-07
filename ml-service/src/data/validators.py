from dataclasses import dataclass, field
import pandas as pd
from .schemas import CANONICAL_COLUMNS, NUMERIC_COLUMNS

@dataclass
class ValidationResult:
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    info: list[str] = field(default_factory=list)

def validate(df: pd.DataFrame) -> ValidationResult:
    r = ValidationResult()
    missing = [c for c in CANONICAL_COLUMNS if c not in df]
    if missing: r.errors.append(f"Missing canonical columns: {', '.join(missing)}")
    for c in NUMERIC_COLUMNS:
        if c in df and df[c].notna().any() and not pd.api.types.is_numeric_dtype(df[c]): r.errors.append(f"Non-numeric values in {c}")
    for c in [x for x in NUMERIC_COLUMNS if x.endswith("_count")] + ["total_crime"]:
        if c in df and (pd.to_numeric(df[c], errors="coerce") < 0).any(): r.errors.append(f"Negative values in {c}")
    if "area" in df and (pd.to_numeric(df.area, errors="coerce") <= 0).any(): r.errors.append("Non-positive area values")
    if "latitude" in df and ((df.latitude < -90) | (df.latitude > 90)).any(): r.errors.append("Invalid latitude values")
    if "longitude" in df and ((df.longitude < -180) | (df.longitude > 180)).any(): r.errors.append("Invalid longitude values")
    r.warnings += [f"Missing values in {c}: {n}" for c, n in df.isna().sum().items() if n]
    for label, count in [("duplicate rows", df.duplicated().sum()), ("duplicate locations", df.location.duplicated().sum()), ("duplicate coordinate pairs", df.duplicated(["latitude", "longitude"]).sum())]:
        if count: r.warnings.append(f"{label}: {count}")
    components = ["murder_count", "rape_count", "gangrape_count", "robbery_count", "theft_count", "assault_count", "sexual_harassment_count"]
    if all(c in df for c in components + ["total_crime"]):
        mismatch = (df[components].sum(axis=1) != df.total_crime).sum()
        if mismatch: r.warnings.append(f"total_crime differs from component sum in {mismatch} rows")
    if df.is_synthetic.any(): r.info.append("Synthetic Noida/Gurgaon data is for pipeline testing only, not geographic crime evidence.")
    return r
