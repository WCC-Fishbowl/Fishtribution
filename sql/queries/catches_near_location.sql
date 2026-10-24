PREPARE catches_near_location (
    double precision,
    double precision,
    double precision,
    integer
) AS
SELECT
    c.catch_id,
    c.user_id,
    c.taxon_id,
    f.common_name,
    c.latitude,
    c.longitude,
    c.weight_kg,
    c.length_cm,
    c.caught_at
FROM catches c
JOIN fish_taxa f
    ON c.taxon_id = f.taxon_id
WHERE c.deleted_at IS NULL
  AND c.pos IS NOT NULL
  AND ST_DWithin(
      c.pos,
      ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
      $3
  )
ORDER BY c.caught_at DESC
LIMIT LEAST(GREATEST($4, 1), 500);
