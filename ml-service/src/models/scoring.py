import numpy as np
import pandas as pd

def quantile01(values):
    return np.clip(pd.Series(values).rank(method="average", pct=True).to_numpy(), 0, 1)

def risk_scores(df, labels, anomaly, weights=(0.45, 0.2, 0.2, 0.15)):
    severity = quantile01(df["severity_score"]); density = quantile01(df["crime_density"]); anomaly = quantile01(anomaly)
    means = pd.Series(df["severity_score"].to_numpy()).groupby(labels).mean()
    cluster = quantile01(pd.Series(labels).map(means).fillna(df.severity_score.mean()))
    score = np.clip(weights[0] * severity + weights[1] * density + weights[2] * cluster + weights[3] * anomaly, 0, 1)
    return score, np.select([score < .25, score < .5, score < .75], ["LOW", "MEDIUM", "HIGH"], default="VERY_HIGH"), severity
