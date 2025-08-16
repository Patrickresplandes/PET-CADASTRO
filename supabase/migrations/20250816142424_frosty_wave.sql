/*
  # Create residents and pets tables

  1. New Tables
    - `residents`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `apartment` (text, not null)
      - `phone` (text, not null)
      - `email` (text, not null)
      - `created_at` (timestamp)
    - `pets`
      - `id` (uuid, primary key)
      - `resident_id` (uuid, foreign key)
      - `resident_name` (text, not null)
      - `resident_apartment` (text, not null)
      - `name` (text, not null)
      - `species` (text, not null)
      - `breed` (text, not null)
      - `age` (integer, not null)
      - `description` (text)
      - `photo` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (since it's a condo directory)
    - Add policies for authenticated users to insert data
*/

-- Create residents table
CREATE TABLE IF NOT EXISTS residents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  apartment text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create pets table
CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  resident_name text NOT NULL,
  resident_apartment text NOT NULL,
  name text NOT NULL,
  species text NOT NULL,
  breed text NOT NULL,
  age integer NOT NULL DEFAULT 0,
  description text DEFAULT '',
  photo text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (condo directory is public to residents)
CREATE POLICY "Anyone can read residents"
  ON residents
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read pets"
  ON pets
  FOR SELECT
  TO public
  USING (true);

-- Create policies for inserting data (anyone can register)
CREATE POLICY "Anyone can insert residents"
  ON residents
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can insert pets"
  ON pets
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pets_resident_id ON pets(resident_id);
CREATE INDEX IF NOT EXISTS idx_pets_species ON pets(species);
CREATE INDEX IF NOT EXISTS idx_residents_apartment ON residents(apartment);