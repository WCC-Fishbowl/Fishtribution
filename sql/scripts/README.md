Fishtribution Synthetic Data Generator

The script generates realistic looking data for the Fishtribution maps and stats.

It will be able to,

Generate 100 fake users and 10,000 fish catches using Faker.

Uses Perlin noise to distribute fish species across different areas.

Places catches within mapped water boundaries around Ann Arbor.

Uses Census population data to influence catch locations.

Varies catches by season and time of day, covering 2023–2025.


Installation

Install the Python libraries from the project's root

python -m pip install -r sql/requirements.txt

Run

python sql/scripts/generate_realistic_data.py

