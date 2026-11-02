CREATE TABLE catch_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    catch_id UUID NOT NULL REFERENCES catches(id) ON DELETE CASCADE,
    
    s3_key TEXT NOT NULL,
    
    original_filename TEXT,
    mime_type TEXT,
    file_size_bytes BIGINT,
    width INTEGER,
    height INTEGER,
    
    -- Order photos within catch view
    rank INTEGER,
    UNIQUE (catch_id, rank),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_catch_images_catch_id ON catch_images(catch_id);
CREATE INDEX idx_catch_images_processing_status ON catch_images(processing_status);
CREATE INDEX idx_catch_images_rank ON catch_images(catch_id, rank NULLS LAST);
