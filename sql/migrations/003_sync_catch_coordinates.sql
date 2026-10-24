CREATE OR REPLACE FUNCTION sync_catch_coordinates()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    coordinates_changed BOOLEAN;
    position_changed BOOLEAN;
BEGIN
    IF TG_OP = 'INSERT' THEN
        coordinates_changed := NEW.latitude IS NOT NULL OR NEW.longitude IS NOT NULL;
        position_changed := NEW.pos IS NOT NULL;
    ELSE
        coordinates_changed :=
            NEW.latitude IS DISTINCT FROM OLD.latitude
            OR NEW.longitude IS DISTINCT FROM OLD.longitude;
        position_changed := NEW.pos IS DISTINCT FROM OLD.pos;
    END IF;

    IF coordinates_changed AND position_changed THEN
        IF NEW.latitude IS NULL OR NEW.longitude IS NULL OR NEW.pos IS NULL THEN
            RAISE EXCEPTION 'Conflicting catch coordinate changes';
        END IF;

        IF ABS(NEW.longitude - ST_X(NEW.pos::geometry)) > 0.000001
           OR ABS(NEW.latitude - ST_Y(NEW.pos::geometry)) > 0.000001 THEN
            RAISE EXCEPTION 'Catch coordinates do not match position';
        END IF;

    ELSIF position_changed THEN
        IF NEW.pos IS NULL THEN
            NEW.latitude := NULL;
            NEW.longitude := NULL;
        ELSE
            NEW.longitude := ROUND(ST_X(NEW.pos::geometry)::numeric, 6);
            NEW.latitude := ROUND(ST_Y(NEW.pos::geometry)::numeric, 6);
        END IF;

    ELSIF coordinates_changed THEN
        IF NEW.latitude IS NULL OR NEW.longitude IS NULL THEN
            NEW.pos := NULL;
        ELSE
            NEW.pos := ST_SetSRID(
                ST_MakePoint(NEW.longitude, NEW.latitude),
                4326
            )::geography;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_catch_coordinates ON catches;

CREATE TRIGGER trg_sync_catch_coordinates
BEFORE INSERT OR UPDATE OF latitude, longitude, pos ON catches
FOR EACH ROW
EXECUTE FUNCTION sync_catch_coordinates();
