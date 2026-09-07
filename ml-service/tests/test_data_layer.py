import sys
from pathlib import Path
import pandas as pd
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from data.adapters import adapt
from data.validators import validate

def test_adapters_and_synthetic_tagging():
    source = pd.DataFrame({"nm_pol": ["x"], "murder": [1], "long": [77], "lat": [28], "totalcrime": [1], "totarea": [2]})
    out = adapt(source, "crime.csv", "Delhi", "real", False)
    assert out.location.iloc[0] == "x" and not out.is_synthetic.iloc[0]

def test_normalized_noida_and_gurgaon_headers_adapt():
    source = pd.DataFrame({"location": ["x"], "assault_murders": [1], "total_area": [2], "total_crime": [1], "longitude": [77], "latitude": [28]})
    for region in ("Noida", "Gurgaon"):
        out = adapt(source, f"{region.lower()}.csv", region, "dummy", True)
        assert list(out.columns) == ["region", "location", "latitude", "longitude", "area", "murder_count", "rape_count", "gangrape_count", "robbery_count", "theft_count", "assault_count", "sexual_harassment_count", "total_crime", "crime_density", "source_file", "source_type", "is_synthetic"]
        assert out.is_synthetic.iloc[0]

def test_validation_detects_bad_coordinates_negative_and_duplicates():
    df = pd.DataFrame({"location": ["x", "x"], "latitude": [91, 91], "longitude": [77, 77], "area": [1, 1], "murder_count": [-1, -1], "total_crime": [0, 0]})
    result = validate(df.assign(**{c: pd.NA for c in ["region", "rape_count", "gangrape_count", "robbery_count", "theft_count", "assault_count", "sexual_harassment_count", "crime_density", "source_file", "source_type", "is_synthetic"]}))
    assert any("latitude" in e for e in result.errors) and any("Negative" in e for e in result.errors)
    assert any("duplicate" in w for w in result.warnings)
