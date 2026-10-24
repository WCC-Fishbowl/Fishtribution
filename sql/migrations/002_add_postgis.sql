CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE catches
ADD COLUMN IF NOT EXISTS pos geography(Point, 4326);

UPDATE catches
SET pos = ST_SetSRID(
    ST_MakePoint(longitude, latitude),
    4326
)::geography
WHERE latitude IS NOT NULL
  AND longitude IS NOT NULL
  AND pos IS NULL;

CREATE INDEX IF NOT EXISTS idx_catches_pos
ON catches
USING GIST (pos)
WHERE deleted_at IS NULL;
