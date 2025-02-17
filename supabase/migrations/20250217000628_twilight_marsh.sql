/*
  # Create apartments table and related schemas

  1. New Tables
    - `apartments`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text)
      - `price` (numeric, required)
      - `address` (text, required)
      - `latitude` (numeric, required)
      - `longitude` (numeric, required)
      - `bedrooms` (integer)
      - `bathrooms` (integer)
      - `area` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_id` (uuid, foreign key to auth.users)
      - `images` (text array)
      - `status` (enum: available, rented, sold)

  2. Security
    - Enable RLS on `apartments` table
    - Add policies for:
      - Anyone can view available apartments
      - Authenticated users can create apartments
      - Users can only update and delete their own apartments
*/

-- Create enum type for apartment status
CREATE TYPE apartment_status AS ENUM ('available', 'rented', 'sold');

-- Create apartments table
CREATE TABLE IF NOT EXISTS apartments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price numeric NOT NULL,
  address text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  bedrooms integer,
  bathrooms integer,
  area numeric,
  images text[],
  status apartment_status DEFAULT 'available',
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_price CHECK (price >= 0),
  CONSTRAINT valid_area CHECK (area >= 0),
  CONSTRAINT valid_coordinates CHECK (
    latitude BETWEEN -90 AND 90 AND
    longitude BETWEEN -180 AND 180
  )
);

-- Enable RLS
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view available apartments"
  ON apartments
  FOR SELECT
  USING (status = 'available');

CREATE POLICY "Authenticated users can create apartments"
  ON apartments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own apartments"
  ON apartments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own apartments"
  ON apartments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS apartments_user_id_idx ON apartments(user_id);
CREATE INDEX IF NOT EXISTS apartments_status_idx ON apartments(status);
CREATE INDEX IF NOT EXISTS apartments_location_idx ON apartments(latitude, longitude);