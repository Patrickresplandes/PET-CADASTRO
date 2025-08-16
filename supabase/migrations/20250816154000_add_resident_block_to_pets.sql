/*
  # Add resident_block field to pets table
  
  This migration adds a resident_block field to the pets table
  to store the block information along with the resident data.
*/

-- Add resident_block column to pets table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'pets' AND column_name = 'resident_block') THEN
        ALTER TABLE pets ADD COLUMN resident_block TEXT;
    END IF;
END $$;

-- Update existing records to have a default block value if needed
UPDATE pets SET resident_block = '1' WHERE resident_block IS NULL OR resident_block = '';

-- Make resident_block column have a default value
ALTER TABLE pets ALTER COLUMN resident_block SET DEFAULT '1';
