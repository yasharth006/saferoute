import sys
from pathlib import Path
import numpy as np
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from features.crime_features import build_crime_features
from models.scoring import risk_scores

def test_feature_generation_has_finite_model_values():
    df = pd.DataFrame({"murder_count": [1], "rape_count": [2], "gangrape_count": [0], "robbery_count": [3], "theft_count": [4], "assault_count": [1], "sexual_harassment_count": [2], "area": [10], "crime_density": [1.2]})
    out = build_crime_features(df, {c: 1 for c in df.columns if c.endswith("_count")})
    assert np.isfinite(out.select_dtypes("number").to_numpy()).all()

def test_risk_score_is_bounded_and_deterministic():
    df = pd.DataFrame({"severity_score": [1, 2, 3], "crime_density": [3, 2, 1]})
    a = risk_scores(df, [0, 1, 0], [0.2, 0.4, 0.1])[0]
    b = risk_scores(df, [0, 1, 0], [0.2, 0.4, 0.1])[0]
    assert np.array_equal(a, b) and ((a >= 0) & (a <= 1)).all()

def test_primary_filter_excludes_synthetic_rows():
    df = pd.DataFrame({"region": ["Delhi", "Noida"], "is_synthetic": [False, True]})
    assert list(df[~df.is_synthetic].region) == ["Delhi"]
