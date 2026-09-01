import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors

def add_spatial_features(df: pd.DataFrame, neighbors: int = 5) -> pd.DataFrame:
    out = df.copy()
    coords = out[["latitude", "longitude"]].astype(float).to_numpy()
    out["scaled_latitude"] = (coords[:, 0] - coords[:, 0].mean()) / (coords[:, 0].std() or 1)
    out["scaled_longitude"] = (coords[:, 1] - coords[:, 1].mean()) / (coords[:, 1].std() or 1)
    k = min(neighbors + 1, len(out))
    distances = NearestNeighbors(n_neighbors=k).fit(coords).kneighbors(coords, return_distance=True)[0]
    out["nearest_neighbor_density"] = 1 / np.maximum(distances[:, 1:].mean(axis=1), 1e-12)
    return out
