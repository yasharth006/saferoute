import numpy as np
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score

def cluster_metrics(X, labels):
    unique = set(labels) - {-1}
    mask = np.array([x in unique for x in labels])
    if len(unique) < 2 or mask.sum() <= len(unique):
        return {"silhouette": None, "davies_bouldin": None, "calinski_harabasz": None}
    labels = np.array(labels)
    return {"silhouette": float(silhouette_score(X[mask], labels[mask])), "davies_bouldin": float(davies_bouldin_score(X[mask], labels[mask])), "calinski_harabasz": float(calinski_harabasz_score(X[mask], labels[mask]))}
