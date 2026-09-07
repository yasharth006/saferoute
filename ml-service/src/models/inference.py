from pathlib import Path
import pandas as pd

class RiskInference:
    def __init__(self, artifact_dir=None):
        root = Path(__file__).resolve().parents[2]
        self.scores = pd.read_csv(artifact_dir or root / "data/processed/locality_risk_scores.csv")
    def predict_risk(self, record):
        row = self.scores[self.scores.location.eq(record.get("location"))].iloc[0]
        return row.to_dict()

def predict_risk(record):
    return RiskInference().predict_risk(record)
