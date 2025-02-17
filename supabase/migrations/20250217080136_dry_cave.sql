/*
  # Update RLS policies for place_types table

  1. Changes
    - Drop existing RLS policies for place_types table
    - Create new policies that properly handle all operations
    - Maintain security while allowing necessary operations

  2. Security
    - Enable RLS
    - Add policies for SELECT, INSERT, UPDATE, and DELETE operations
    - Ensure authenticated users can perform necessary operations
*/

-- Drop existing policies for place_types
DROP POLICY IF EXISTS "Anyone can view place types" ON place_types;
DROP POLICY IF EXISTS "Authenticated users can manage place types" ON place_types;

-- Create new, more specific policies
CREATE POLICY "Anyone can view place types"
  ON place_types
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert place types"
  ON place_types
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update place types"
  ON place_types
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete place types"
  ON place_types
  FOR DELETE
  TO authenticated
  USING (true);