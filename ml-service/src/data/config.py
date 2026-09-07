from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = ROOT / "data" / "raw"
PROCESSED_DIR = ROOT / "data" / "processed"
REPORT_PATH = ROOT / "reports" / "data_validation_report.md"
DATASETS = {"crime.csv": ("Delhi", "real", False), "noida.csv": ("Noida", "dummy", True), "gurgaon.csv": ("Gurgaon", "dummy", True)}
