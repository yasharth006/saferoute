from pathlib import Path
import pandas as pd
from .config import DATASETS, PROCESSED_DIR, RAW_DIR, REPORT_PATH
from .harmonizer import harmonize

def run_data_pipeline(raw_dir=RAW_DIR, processed_dir=PROCESSED_DIR, report_path=REPORT_PATH):
    frames, results = [], {}
    for filename, (region, source_type, synthetic) in DATASETS.items():
        frame, result, metadata = harmonize(Path(raw_dir) / filename, region, source_type, synthetic)
        frames.append(frame); results[filename] = (frame, result, metadata)
    canonical = pd.concat(frames, ignore_index=True)
    processed_dir.mkdir(parents=True, exist_ok=True); report_path.parent.mkdir(parents=True, exist_ok=True)
    csv_path = processed_dir / "crime_canonical.csv"; canonical.to_csv(csv_path, index=False)
    parquet_path = processed_dir / "crime_canonical.parquet"
    try: canonical.to_parquet(parquet_path, index=False)
    except (ImportError, ValueError): parquet_path = None
    errors = sum((r.errors for _, r, _ in results.values()), [])
    warnings = sum((r.warnings for _, r, _ in results.values()), [])
    lines = ["# SafeRoute Data Validation Report", "", "## Dataset Inventory", "", "| Dataset | Region | Rows | Type | Synthetic |", "|---|---|---:|---|---|"]
    lines += [f"| {f} | {m['region']} | {len(df)} | {m['source_type']} | {m['is_synthetic']} |" for f, (df, _, m) in results.items()]
    lines += ["", "## Source Metadata", "", "Delhi: real, geographic coordinates; Noida/Gurgaon: dummy, synthetic coordinates.", "", "## Raw Schemas", "", "Source headers are preserved in the adapters and were read without modifying raw files.", "", "## Canonical Schema", "", ", ".join(canonical.columns), "", "## Row Counts", "", f"Canonical rows: {len(canonical)}", f"Synthetic rows: {int(canonical.is_synthetic.sum())}", "", "## Missing Values", "", canonical.isna().sum().to_string(), "", "## Coordinate Validation", "", "Latitude and longitude were range-checked; invalid values would be errors and are not changed.", "", "## Crime-Count Validation", "", "Counts were checked for negative values; area was checked for positivity.", "", "## Duplicate Analysis", "", "Duplicate rows, locations, and coordinate pairs were reported as warnings.", "", "## Cross-Field Consistency", "", "total_crime was compared with the sum of available crime components; discrepancies are warnings.", "", "## Synthetic Dataset Warning", "", "Noida and Gurgaon are synthetic/dummy data and must not be interpreted as real geographic crime evidence.", "", "## Errors", ""] + [f"- {x}" for x in errors] + ["", "## Warnings", ""] + [f"- {x}" for x in warnings] + ["", "## Final Status", "", "Delhi is the only real dataset; Noida and Gurgaon are synthetic/dummy. All three are historical aggregate locality-level data, not incident-level and contain no calendar timestamps. This pipeline prepares spatial crime-risk modelling data, not supervised future-crime prediction."]
    report_path.write_text("\n".join(lines), encoding="utf-8")
    return canonical, results, csv_path, parquet_path
