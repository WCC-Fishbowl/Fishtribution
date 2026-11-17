CREATE TABLE taxon_images (
    image_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    taxon_id UUID NOT NULL REFERENCES fish_taxa(taxon_id) ON DELETE CASCADE,
    
    s3_key TEXT NOT NULL,
    
    original_filename TEXT,
    mime_type TEXT,
    file_size BIGINT,
    width INTEGER,
    height INTEGER,
    
    -- Order photos within catch view
    rank INTEGER,
    UNIQUE (taxon_id, rank),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_taxon_images_catch_id ON taxon_images(taxon_id);
CREATE INDEX idx_taxon_images_rank ON taxon_images(taxon_id, rank NULLS LAST);
