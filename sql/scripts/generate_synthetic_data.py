
import random
import csv
import uuid
import os

random.seed(42)

locations = [
    (42.5, -83.2),
    (42.7, -84.4),
    (43.1, -85.6)
]

probabilities = [0.6, 0.3, 0.1]

num_catches = 10000

users = [
    "10000000-0000-4000-8000-000000000001",
    "10000000-0000-4000-8000-000000000002"
]

fish = [
    "20000000-0000-4000-8000-000000000001",
    "20000000-0000-4000-8000-000000000002",
    "20000000-0000-4000-8000-000000000003",
    "20000000-0000-4000-8000-000000000004",
    "20000000-0000-4000-8000-000000000005"
]

os.makedirs("sql/generated", exist_ok=True)

with open("sql/generated/catches.csv", "w", newline="") as file:
    writer = csv.writer(file)

    writer.writerow([
        "catch_id",
        "user_id",
        "taxon_id",
        "latitude",
        "longitude"
    ])

    for i in range(num_catches):
        location = random.choices(
            locations,
            weights=probabilities,
            k=1
        )[0]

        latitude = random.gauss(location[0], 0.02)
        longitude = random.gauss(location[1], 0.02)

        writer.writerow([
            uuid.uuid4(),
            random.choice(users),
            random.choice(fish),
            round(latitude, 6),
            round(longitude, 6)
        ])

print("Generated", num_catches, "synthetic catches")
print("Saved to sql/generated/catches.csv")
