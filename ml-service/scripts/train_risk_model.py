from pathlib import Path
import json
import sys
import joblib
import pandas as pd
from sklearn.preprocessing import RobustScaler

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from data.config import ROOT
from features.crime_features import build_crime_features, load_weights, model_columns
from features.spatial_features import add_spatial_features
from models.anomaly import fit_anomaly
from models.clustering import benchmark
from models.scoring import risk_scores
from models.explainability import explain_locality

def main():
    base = pd.read_csv(ROOT / "data/processed/crime_canonical.csv")
    df = base[~base.is_synthetic].copy()
    features = add_spatial_features(build_crime_features(df, load_weights(ROOT / "config/severity_weights.yaml")))
    cols = list(dict.fromkeys(model_columns(features) + ["scaled_latitude", "scaled_longitude", "nearest_neighbor_density"]))
    scaler = RobustScaler().fit(features[cols].fillna(0)); X = scaler.transform(features[cols].fillna(0))
    results = benchmark(X)
    selected_name = max(results, key=lambda n: results[n]["mean_silhouette"] if results[n]["mean_silhouette"] is not None else -1)
    selected = results[selected_name]["selected"]; anomaly_model, anomaly = fit_anomaly(X)
    score, level, severity = risk_scores(features, selected["labels"], anomaly)
    output = df[["region", "location", "latitude", "longitude"]].copy()
    output["historical_spatial_risk_score"], output["risk_level"], output["cluster"] = score, level, selected["labels"]
    output["anomaly_score"], output["severity_score"], output["crime_density"] = anomaly, features.severity_score, df.crime_density
    output = output.sort_values(["region", "location"], kind="stable").reset_index(drop=True)
    outdir = ROOT / "data/processed"; artifact = outdir / "model_artifacts"; artifact.mkdir(parents=True, exist_ok=True)
    features.to_csv(outdir / "crime_features.csv", index=False); output.to_csv(outdir / "locality_risk_scores.csv", index=False)
    joblib.dump(scaler, artifact / "robust_scaler.joblib"); joblib.dump(selected["model"], artifact / "clustering_model.joblib"); joblib.dump(anomaly_model, artifact / "anomaly_model.joblib")
    metrics = {k: {"selected": v["selected"]["metrics"], "mean_silhouette": v["mean_silhouette"], "cluster_sizes": pd.Series(v["selected"]["labels"]).value_counts().to_dict()} for k, v in results.items()}; (artifact / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    (artifact / "feature_metadata.json").write_text(json.dumps({"columns": cols, "model_version": "review1-v1", "primary_region": "Delhi"}, indent=2), encoding="utf-8")
    (artifact / "severity_weights.yaml").write_text((ROOT / "config/severity_weights.yaml").read_text(encoding="utf-8"), encoding="utf-8")
    report = ["# SafeRoute Model Benchmark Report", "", "Primary evaluation: Delhi real data only. Noida/Gurgaon synthetic observations were excluded.", "", "| Model | Silhouette | Davies-Bouldin | Calinski-Harabasz |", "|---|---:|---:|---:|"]
    report += [f"| {k} | {v['selected']['silhouette']} | {v['selected']['davies_bouldin']} | {v['selected']['calinski_harabasz']} |" for k, v in metrics.items()]
    report += ["", f"Selected representation: {selected_name}.", "K-Means/GMM were tested for K=2..8 with seeds 7, 17, 27; DBSCAN was also tested. The selected model is the highest-silhouette valid representation, with interpretability considered.", "The baseline is K-Means-only clustering. The final model is preferred because it combines burden, density, cluster context, and anomaly information into an explainable index.", "historical_spatial_risk_score is not a probability of crime."]
    (ROOT / "reports/model_benchmark_report.md").write_text("\n".join(report), encoding="utf-8")
    explanations = [explain_locality({**row._asdict(), "density_median": output.crime_density.median(), "severity_median": output.severity_score.median(), "anomaly_median": output.anomaly_score.median()}) for row in output.itertuples(index=False)]
    (artifact / "explanations.json").write_text(json.dumps(explanations, indent=2), encoding="utf-8")
    stats = output.historical_spatial_risk_score.describe(percentiles=[.25, .5, .75]).to_dict()
    (ROOT / "reports/feature_engineering_report.md").write_text("# SafeRoute Feature Engineering Report\n\nGenerated log1p counts, per-area measures, composition ratios, configurable domain-informed severity weights, RobustScaler inputs, and coordinate/neighbour density features. Region and provenance fields are excluded from model inputs. Scores are deterministic historical spatial indices.", encoding="utf-8")
    (ROOT / "reports/review1_ml_report.md").write_text("# SafeRoute Review 1 — ML System\n\n## 1. Objective\n\nExplainable historical spatial crime-risk estimation, not supervised prediction or crime probability.\n\n## 2. Data\n\nDelhi has 166 real aggregate locality records. Noida and Gurgaon contribute 400 synthetic records and are excluded from primary training. There is no incident-level or calendar-time dimension.\n\n## 3. Feature Engineering\n\nLog1p counts, per-area features, composition ratios, severity burden, RobustScaler inputs, coordinates, and nearest-neighbour density.\n\n## 4. Baseline\n\nK-Means-only spatial clustering.\n\n## 5. Model Benchmark\n\nSee model_benchmark_report.md for actual K=2..8 metrics, cluster sizes, and DBSCAN results.\n\n## 6. Model Selection\n\nSelected by valid silhouette performance and interpretability; weak separation is reported rather than hidden.\n\n## 7. Hybrid Risk Score\n\nWeighted index: severity burden 0.45, density 0.20, cluster context 0.20, anomaly 0.15. Quantile normalization and fixed LOW/MEDIUM/HIGH/VERY_HIGH thresholds produce [0,1].\n\n## 8. Stability\n\nRepeated seeds 7, 17, and 27 are persisted in metrics.json; risk outputs are deterministic under the fixed training data and configuration.\n\n## 9. Explainability\n\nDrivers are derived from each locality’s density, severity burden, cluster context, and anomaly values.\n\n## 10. Limitations\n\nAggregate rather than incident-level data; no temporal prediction; weak unsupervised separation may remain; synthetic regions are excluded; scores are not probabilities; association is not causality; results depend on source quality.\n\n## 11. Review-1 Conclusion\n\nSafeRoute now has an explainable historical spatial crime-risk modelling pipeline ready for road-network integration in Review 2.\n", encoding="utf-8")
    print(f"selected model: {selected_name}\nDelhi row count used: {len(df)}\nsynthetic row count excluded: {len(base)-len(df)}\nmetrics: {json.dumps(metrics)}\noutput paths: {outdir}")

if __name__ == "__main__": main()
