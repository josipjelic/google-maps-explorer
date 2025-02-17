/*
  # Create Places and Place_types tables

  1. New Tables
    - `places`
      - `id` (serial, primary key)
      - `name` (varchar)
      - `place_id` (varchar, unique)
      - `address` (varchar)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `phone` (varchar)
      - `website` (varchar)
      - `rating` (numeric)
      - `review_count` (integer)
      - `opening_hours` (json)
      - `raw_data` (json)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `place_types`
      - `id` (serial, primary key)
      - `name` (varchar)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create places table
CREATE TABLE IF NOT EXISTS places (
    id            serial PRIMARY KEY,
    name          varchar(255) NOT NULL,
    place_id      varchar(255) NOT NULL UNIQUE,
    address       varchar(255) NOT NULL,
    latitude      numeric(10, 8),
    longitude     numeric(11, 8),
    phone         varchar(255),
    website       varchar(255),
    rating        numeric(3, 1),
    review_count  integer,
    opening_hours json,
    raw_data      json,
    created_at    timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create place_types table
CREATE TABLE IF NOT EXISTS place_types (
    id   serial PRIMARY KEY,
    name varchar(255) NOT NULL UNIQUE
);

-- Create junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS place_type_relations (
    place_id      integer REFERENCES places(id) ON DELETE CASCADE,
    place_type_id integer REFERENCES place_types(id) ON DELETE CASCADE,
    PRIMARY KEY (place_id, place_type_id)
);

-- Enable RLS
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_type_relations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view places"
    ON places
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert places"
    ON places
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update places"
    ON places
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete places"
    ON places
    FOR DELETE
    TO authenticated
    USING (true);

-- Policies for place_types
CREATE POLICY "Anyone can view place types"
    ON place_types
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can manage place types"
    ON place_types
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policies for place_type_relations
CREATE POLICY "Anyone can view place type relations"
    ON place_type_relations
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can manage place type relations"
    ON place_type_relations
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for places
CREATE TRIGGER update_places_updated_at
    BEFORE UPDATE ON places
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();