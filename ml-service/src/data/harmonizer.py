from .adapters import adapt
from .loaders import load_csv
from .validators import validate

def harmonize(path, region, source_type, synthetic):
    canonical = adapt(load_csv(path), path.name, region, source_type, synthetic)
    return canonical, validate(canonical), {"region": region, "source_type": source_type, "is_synthetic": synthetic}
