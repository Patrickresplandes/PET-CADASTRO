/*
  # Fix RLS Policies for Authentication Issues

  This migration fixes the 406 error by ensuring proper RLS policies
  are in place for both authenticated and public access where needed.
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can insert their own resident data" ON residents;
DROP POLICY IF EXISTS "Users can read their own resident data" ON residents;
DROP POLICY IF EXISTS "Anyone can read all residents for directory" ON residents;

DROP POLICY IF EXISTS "Users can insert pets for their residents" ON pets;
DROP POLICY IF EXISTS "Anyone can read all pets for directory" ON pets;
DROP POLICY IF EXISTS "Users can read their own pets" ON pets;

-- Create more permissive policies for residents table
CREATE POLICY "Enable read access for all users"
  ON residents
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON residents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id"
  ON residents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
  ON residents
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create more permissive policies for pets table
CREATE POLICY "Enable read access for all users"
  ON pets
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
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

CREATE POLICY "Enable update for users based on resident ownership"
  ON pets
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM residents 
      WHERE residents.id = pets.resident_id 
      AND residents.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM residents 
      WHERE residents.id = pets.resident_id 
      AND residents.user_id = auth.uid()
    )
  );

CREATE POLICY "Enable delete for users based on resident ownership"
  ON pets
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM residents 
      WHERE residents.id = pets.resident_id 
      AND residents.user_id = auth.uid()
    )
  );

-- Ensure RLS is enabled
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
