def explain_locality(row):
    drivers = []
    if row["crime_density"] >= row.get("density_median", row["crime_density"]): drivers.append("high crime density")
    if row["severity_score"] >= row.get("severity_median", row["severity_score"]): drivers.append("high severity-weighted burden")
    if row.get("cluster_risk", 0) >= 0.5: drivers.append("higher-risk spatial cluster")
    if row.get("anomaly_score", 0) >= row.get("anomaly_median", row["anomaly_score"]): drivers.append("unusual local crime profile")
    return {"location": row["location"], "risk_score": float(row["historical_spatial_risk_score"]), "risk_level": row["risk_level"], "drivers": drivers or ["lower relative historical burden"]}
