# SafeRoute Data Validation Report

## Dataset Inventory

| Dataset | Region | Rows | Type | Synthetic |
|---|---|---:|---|---|
| crime.csv | Delhi | 166 | real | False |
| noida.csv | Noida | 200 | dummy | True |
| gurgaon.csv | Gurgaon | 200 | dummy | True |

## Source Metadata

Delhi: real, geographic coordinates; Noida/Gurgaon: dummy, synthetic coordinates.

## Raw Schemas

Source headers are preserved in the adapters and were read without modifying raw files.

## Canonical Schema

region, location, latitude, longitude, area, murder_count, rape_count, gangrape_count, robbery_count, theft_count, assault_count, sexual_harassment_count, total_crime, crime_density, source_file, source_type, is_synthetic

## Row Counts

Canonical rows: 566
Synthetic rows: 400

## Missing Values

region                     0
location                   0
latitude                   0
longitude                  0
area                       0
murder_count               0
rape_count                 0
gangrape_count             0
robbery_count              0
theft_count                0
assault_count              0
sexual_harassment_count    0
total_crime                0
crime_density              0
source_file                0
source_type                0
is_synthetic               0

## Coordinate Validation

Latitude and longitude were range-checked; invalid values would be errors and are not changed.

## Crime-Count Validation

Counts were checked for negative values; area was checked for positivity.

## Duplicate Analysis

Duplicate rows, locations, and coordinate pairs were reported as warnings.

## Cross-Field Consistency

total_crime was compared with the sum of available crime components; discrepancies are warnings.

## Synthetic Dataset Warning

Noida and Gurgaon are synthetic/dummy data and must not be interpreted as real geographic crime evidence.

## Errors


## Warnings

- duplicate locations: 9
- duplicate coordinate pairs: 1
- duplicate locations: 19
- duplicate coordinate pairs: 1

## Final Status

Delhi is the only real dataset; Noida and Gurgaon are synthetic/dummy. All three are historical aggregate locality-level data, not incident-level and contain no calendar timestamps. This pipeline prepares spatial crime-risk modelling data, not supervised future-crime prediction.