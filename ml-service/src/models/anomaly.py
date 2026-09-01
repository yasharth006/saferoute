from sklearn.ensemble import IsolationForest

def fit_anomaly(X, seed=7):
    model = IsolationForest(random_state=seed, n_estimators=200, contamination="auto").fit(X)
    return model, -model.score_samples(X)
