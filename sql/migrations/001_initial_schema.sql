-- Fishtribution | Team Fishbowl
-- Migration 001: Initial PostgreSQL schema (review before running on Neon)
-- Authentication and photo/site features will be added separately.

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'angler'
        CHECK (role IN ('angler', 'moderator', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    preferred_weight_unit VARCHAR(5) NOT NULL DEFAULT 'lb'
        CHECK (preferred_weight_unit IN ('kg', 'lb')),
    preferred_length_unit VARCHAR(5) NOT NULL DEFAULT 'in'
        CHECK (preferred_length_unit IN ('cm', 'in')),
    profile_visibility VARCHAR(10) NOT NULL DEFAULT 'private'
        CHECK (profile_visibility IN ('public', 'private')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE fish_taxa (
    taxon_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    common_name VARCHAR(150) NOT NULL,
    scientific_name VARCHAR(200) NOT NULL UNIQUE,
    family VARCHAR(150),
    genus VARCHAR(150),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE catches (
    catch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- NOTE: NOT NULL removed from catches.user_id 2026-10-25 in order to allow soft deletion.
    user_id UUID REFERENCES users(user_id) ON DELETE RESTRICT,
    taxon_id UUID NOT NULL REFERENCES fish_taxa(taxon_id) ON DELETE RESTRICT,
    weight_kg NUMERIC(10, 3) CHECK (weight_kg > 0),
    length_cm NUMERIC(10, 2) CHECK (length_cm > 0),
    bait_or_lure VARCHAR(150),
    notes TEXT,
    latitude NUMERIC(9, 6) CHECK (latitude BETWEEN -90 AND 90),
    longitude NUMERIC(9, 6) CHECK (longitude BETWEEN -180 AND 180),
    caught_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT chk_catches_coordinates CHECK (
        (latitude IS NULL AND longitude IS NULL)
        OR (latitude IS NOT NULL AND longitude IS NOT NULL)
    )
);

CREATE INDEX idx_catches_user_date ON catches(user_id, caught_at DESC) WHERE catches.deleted_at IS NULL;
CREATE INDEX idx_catches_taxon ON catches(taxon_id) WHERE catches.deleted_at IS NULL;
CREATE INDEX idx_catches_caught_at
ON catches(caught_at DESC) WHERE catches.deleted_at IS NULL;
