/*
  # Add block field to residents table
  
  This migration adds a block field to the residents table
  to separate block and apartment numbers.
*/

-- Add block column to residents table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'residents' AND column_name = 'block') THEN
        ALTER TABLE residents ADD COLUMN block TEXT;
    END IF;
END $$;

-- Update existing records to have a default block value if needed
UPDATE residents SET block = '1' WHERE block IS NULL OR block = '';

-- Make block column required
ALTER TABLE residents ALTER COLUMN block SET NOT NULL;
