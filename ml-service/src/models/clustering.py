from sklearn.cluster import DBSCAN, KMeans
from sklearn.mixture import GaussianMixture
from .evaluation import cluster_metrics

def benchmark(X, seeds=(7, 17, 27), k_values=range(2, 9)):
    candidates = {f"kmeans_k{k}": lambda s, k=k: KMeans(n_clusters=k, random_state=s, n_init=20) for k in k_values}
    candidates.update({f"gaussian_mixture_k{k}": lambda s, k=k: GaussianMixture(n_components=k, random_state=s) for k in k_values})
    candidates["dbscan"] = lambda s: DBSCAN(eps=0.9, min_samples=5)
    results = {}
    for name, factory in candidates.items():
        runs = []
        for seed in seeds:
            model = factory(seed); labels = model.fit_predict(X); runs.append({"seed": seed, "metrics": cluster_metrics(X, labels), "labels": labels.tolist(), "model": model})
        valid = [x for x in runs if x["metrics"]["silhouette"] is not None]
        results[name] = {"runs": runs, "mean_silhouette": sum(x["metrics"]["silhouette"] for x in valid) / len(valid) if valid else None, "selected": max(valid or runs, key=lambda x: x["metrics"]["silhouette"] if x["metrics"]["silhouette"] is not None else -1)}
    return results
