from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from data.pipeline import run_data_pipeline

if __name__ == "__main__":
    canonical, results, csv_path, parquet_path = run_data_pipeline()
    errors = sum(len(r.errors) for _, r, _ in results.values()); warnings = sum(len(r.warnings) for _, r, _ in results.values())
    print(f"datasets discovered: {len(results)}; rows per dataset: " + ", ".join(f"{f}={len(df)}" for f, (df, _, _) in results.items()))
    print(f"canonical rows: {len(canonical)}; synthetic rows: {int(canonical.is_synthetic.sum())}; validation errors: {errors}; warnings: {warnings}")
    print(f"CSV: {csv_path}; Parquet: {parquet_path or 'not available'}")
    raise SystemExit(1 if errors else 0)
