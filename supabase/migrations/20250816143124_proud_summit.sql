/*
  # Add authentication and user-specific pets

  1. Security Updates
    - Update RLS policies to require authentication
    - Add user-specific access controls
    - Enable authentication for residents and pets tables

  2. Changes
    - Modify residents table to link with auth.users
    - Update pets table policies for user-specific access
    - Add user_id column to residents table
*/

-- Add user_id column to residents table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'residents' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE residents ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Update RLS policies for residents
DROP POLICY IF EXISTS "Anyone can insert residents" ON residents;
DROP POLICY IF EXISTS "Anyone can read residents" ON residents;

CREATE POLICY "Users can insert their own resident data"
  ON residents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own resident data"
  ON residents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read all residents for directory"
  ON residents
  FOR SELECT
  TO authenticated
  USING (true);

-- Update RLS policies for pets
DROP POLICY IF EXISTS "Anyone can insert pets" ON pets;
DROP POLICY IF EXISTS "Anyone can read pets" ON pets;

CREATE POLICY "Users can insert pets for their residents"
  ON pets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM residents 
      WHERE residents.id = pets.resident_id 
      AND residents.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can read all pets for directory"
  ON pets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read their own pets"
  ON pets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM residents 
      WHERE residents.id = pets.resident_id 
      AND residents.user_id = auth.uid()
    )
  );