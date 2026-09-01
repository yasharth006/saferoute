# SafeRoute Model Benchmark Report

Primary evaluation: Delhi real data only. Noida/Gurgaon synthetic observations were excluded.

| Model | Silhouette | Davies-Bouldin | Calinski-Harabasz |
|---|---:|---:|---:|
| kmeans_k2 | 0.3710462245788411 | 1.0905933922166806 | 46.58304934989128 |
| kmeans_k3 | 0.186008887368128 | 1.7083893009590145 | 42.921378334200845 |
| kmeans_k4 | 0.17683832303590036 | 1.5923262031321972 | 38.64501135784709 |
| kmeans_k5 | 0.1725713407886779 | 1.7003119180214514 | 35.586397871784364 |
| kmeans_k6 | 0.18056120114042135 | 1.5598489981637247 | 32.73251881064508 |
| kmeans_k7 | 0.17191124291391202 | 1.5678973637435714 | 29.477234175299095 |
| kmeans_k8 | 0.1627680118806597 | 1.6494964432467676 | 27.53155440074568 |
| gaussian_mixture_k2 | 0.3710462245788411 | 1.0905933922166806 | 46.58304934989128 |
| gaussian_mixture_k3 | 0.20929868495907686 | 1.7425118555614967 | 41.92172455903113 |
| gaussian_mixture_k4 | 0.17517986605940378 | 1.6414749103058446 | 38.40000044788445 |
| gaussian_mixture_k5 | 0.17328500310755543 | 1.6467092383076192 | 35.37812699389282 |
| gaussian_mixture_k6 | 0.1550186656971753 | 1.7222969637252497 | 30.24694285832883 |
| gaussian_mixture_k7 | 0.16542967775124454 | 1.5788440006688922 | 28.84854439967278 |
| gaussian_mixture_k8 | 0.1554993834504426 | 1.6777075178819303 | 26.957080743961775 |
| dbscan | None | None | None |

Selected representation: kmeans_k2.
K-Means/GMM were tested for K=2..8 with seeds 7, 17, 27; DBSCAN was also tested. The selected model is the highest-silhouette valid representation, with interpretability considered.
The baseline is K-Means-only clustering. The final model is preferred because it combines burden, density, cluster context, and anomaly information into an explainable index.
historical_spatial_risk_score is not a probability of crime.