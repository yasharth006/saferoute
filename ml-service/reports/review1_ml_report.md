# SafeRoute Review 1 — ML System

## 1. Objective

Explainable historical spatial crime-risk estimation, not supervised prediction or crime probability.

## 2. Data

Delhi has 166 real aggregate locality records. Noida and Gurgaon contribute 400 synthetic records and are excluded from primary training. There is no incident-level or calendar-time dimension.

## 3. Feature Engineering

Log1p counts, per-area features, composition ratios, severity burden, RobustScaler inputs, coordinates, and nearest-neighbour density.

## 4. Baseline

K-Means-only spatial clustering.

## 5. Model Benchmark

See model_benchmark_report.md for actual K=2..8 metrics, cluster sizes, and DBSCAN results.

## 6. Model Selection

Selected by valid silhouette performance and interpretability; weak separation is reported rather than hidden.

## 7. Hybrid Risk Score

Weighted index: severity burden 0.45, density 0.20, cluster context 0.20, anomaly 0.15. Quantile normalization and fixed LOW/MEDIUM/HIGH/VERY_HIGH thresholds produce [0,1].

## 8. Stability

Repeated seeds 7, 17, and 27 are persisted in metrics.json; risk outputs are deterministic under the fixed training data and configuration.

## 9. Explainability

Drivers are derived from each locality’s density, severity burden, cluster context, and anomaly values.

## 10. Limitations

Aggregate rather than incident-level data; no temporal prediction; weak unsupervised separation may remain; synthetic regions are excluded; scores are not probabilities; association is not causality; results depend on source quality.

## 11. Review-1 Conclusion

SafeRoute now has an explainable historical spatial crime-risk modelling pipeline ready for road-network integration in Review 2.
