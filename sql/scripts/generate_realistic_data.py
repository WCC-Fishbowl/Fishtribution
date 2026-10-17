
import csv
import random
import uuid
import os
from datetime import datetime
from zoneinfo import ZoneInfo

import geopandas as gpd
from faker import Faker
from noise import pnoise2
from shapely.geometry import Point

random.seed(42)
Faker.seed(42)

fake = Faker()
os.makedirs("sql/generated", exist_ok=True)

num_users = 100
num_catches = 10000

species = [
    "Largemouth Bass",
    "Bluegill",
    "Yellow Perch",
    "Northern Pike",
    "Walleye"
]

species_weights = [40, 30, 15, 10, 5]

fish_ids = [
    "20000000-0000-4000-8000-000000000001",
    "20000000-0000-4000-8000-000000000002",
    "20000000-0000-4000-8000-000000000003",
    "20000000-0000-4000-8000-000000000004",
    "20000000-0000-4000-8000-000000000005"
]

monthly_weights = [2, 2, 5, 8, 12, 15, 16, 15, 12, 7, 4, 2]

hourly_weights = [
    1, 1, 1, 1, 1, 3,
    8, 12, 10, 8, 7, 7,
    6, 6, 7, 8, 10, 12,
    9, 5, 3, 2, 1, 1
]

users = []

with open("sql/generated/users.csv", "w", newline="") as file:
    writer = csv.writer(file)

    writer.writerow([
        "user_id", "username", "email",
        "display_name", "role"
    ])

    for i in range(num_users):
        user_id = str(uuid.uuid4())
        username = f"synthetic_angler_{i + 1}"

        writer.writerow([
            user_id,
            username,
            f"{username}@example.com",
            fake.name(),
            "angler"
        ])

        users.append(user_id)

print("Generated", len(users), "fictional users")

water = gpd.read_file("sql/generated/ann_arbor_water.geojson")
population = gpd.read_file("sql/generated/ann_arbor_population.geojson")

water = water[water.geom_type.isin(["Polygon", "MultiPolygon"])]
water = water.to_crs(4326)
population = population.to_crs(4326)

water_shape = water.geometry.union_all()
min_lon, min_lat, max_lon, max_lat = water_shape.bounds

locations = []

while len(locations) < 4000:
    lon = random.uniform(min_lon, max_lon)
    lat = random.uniform(min_lat, max_lat)

    if water_shape.covers(Point(lon, lat)):
        locations.append((lon, lat))

location_points = gpd.GeoDataFrame(
    geometry=[Point(lon, lat) for lon, lat in locations],
    crs="EPSG:4326"
)

location_points = gpd.sjoin(
    location_points,
    population[["density", "geometry"]],
    how="left",
    predicate="within"
)

location_points = location_points.dropna(subset=["density"])
location_points = location_points[~location_points.index.duplicated()]

locations = [
    (point.x, point.y)
    for point in location_points.geometry
]

population_weights = [
    min(3, 0.3 + density / 4000)
    for density in location_points["density"]
]

print("Available water locations:", len(locations))

if not locations:
    raise ValueError("No water locations matched the population data")

location_weights = []

for fish in range(len(species)):
    densities = []

    for lon, lat in locations:
        density = 0

        for layer in range(4):
            scale = 0.02 / (2 ** layer)

            density += pnoise2(
                lon / scale,
                lat / scale,
                base=fish * 10 + layer
            ) / (2 ** layer)

        densities.append(density)

    lowest = min(densities)
    highest = max(densities)

    weights = []

    for i in range(len(locations)):
        normalized = (densities[i] - lowest) / (highest - lowest + 0.000001)
        species_density = 0.05 + normalized ** 4

        weights.append(
            species_density * population_weights[i]
        )

    location_weights.append(weights)

with open("sql/generated/realistic_catches.csv", "w", newline="") as file:
    writer = csv.writer(file)

    writer.writerow([
        "catch_id",
        "user_id",
        "taxon_id",
        "latitude",
        "longitude",
        "caught_at"
    ])

    for i in range(num_catches):
        fish = random.choices(
            range(len(species)),
            weights=species_weights
        )[0]

        location_index = random.choices(
            range(len(locations)),
            weights=location_weights[fish]
        )[0]

        lon, lat = locations[location_index]

        year = random.randint(2023, 2025)
        month = random.choices(
            range(1, 13),
            weights=monthly_weights
        )[0]

        hour = random.choices(
            range(24),
            weights=hourly_weights
        )[0]

        if month == 12:
            days = 31
        else:
            start = datetime(year, month, 1)
            end = datetime(year, month + 1, 1)
            days = (end - start).days

        day = random.randint(1, days)
        minute = random.randint(0, 59)

        caught_at = datetime(
            year, month, day, hour, minute,
            tzinfo=ZoneInfo("America/Detroit")
        )

        writer.writerow([
            uuid.uuid4(),
            random.choice(users),
            fish_ids[fish],
            round(lat, 6),
            round(lon, 6),
            caught_at.isoformat()
        ])

print("Generated", num_catches, "synthetic catches")
print("Saved to sql/generated/realistic_catches.csv")
print("Saved to sql/generated/users.csv")
