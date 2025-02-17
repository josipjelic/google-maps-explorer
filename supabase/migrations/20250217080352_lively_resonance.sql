/*
  # Disable Row Level Security

  This migration removes all security restrictions by:
  1. Disabling RLS on all tables
  2. Dropping all existing policies
*/

-- Disable RLS on all tables
ALTER TABLE apartments DISABLE ROW LEVEL SECURITY;
ALTER TABLE places DISABLE ROW LEVEL SECURITY;
ALTER TABLE place_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE place_type_relations DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can view available apartments" ON apartments;
DROP POLICY IF EXISTS "Authenticated users can create apartments" ON apartments;
DROP POLICY IF EXISTS "Users can update their own apartments" ON apartments;
DROP POLICY IF EXISTS "Users can delete their own apartments" ON apartments;

DROP POLICY IF EXISTS "Anyone can view places" ON places;
DROP POLICY IF EXISTS "Authenticated users can insert places" ON places;
DROP POLICY IF EXISTS "Authenticated users can update places" ON places;
DROP POLICY IF EXISTS "Authenticated users can delete places" ON places;

DROP POLICY IF EXISTS "Anyone can view place types" ON place_types;
DROP POLICY IF EXISTS "Authenticated users can insert place types" ON place_types;
DROP POLICY IF EXISTS "Authenticated users can update place types" ON place_types;
DROP POLICY IF EXISTS "Authenticated users can delete place types" ON place_types;

DROP POLICY IF EXISTS "Anyone can view place type relations" ON place_type_relations;
DROP POLICY IF EXISTS "Authenticated users can manage place type relations" ON place_type_relations;