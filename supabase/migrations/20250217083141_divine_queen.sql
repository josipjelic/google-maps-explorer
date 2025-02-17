/*
  # Fix RLS policies

  1. Changes
    - Re-enable RLS on all tables
    - Create appropriate policies for public access
    - Add policies for authenticated users

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated user operations
*/

-- Re-enable RLS on all tables
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_type_relations ENABLE ROW LEVEL SECURITY;

-- Create policies for apartments
CREATE POLICY "Public can view apartments"
  ON apartments
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage apartments"
  ON apartments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for places
CREATE POLICY "Public can view places"
  ON places
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage places"
  ON places
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for place_types
CREATE POLICY "Public can view place types"
  ON place_types
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage place types"
  ON place_types
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for place_type_relations
CREATE POLICY "Public can view place type relations"
  ON place_type_relations
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage place type relations"
  ON place_type_relations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);