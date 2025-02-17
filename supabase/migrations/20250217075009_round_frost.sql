/*
  # Insert sample apartments with demo user

  1. Changes
    - Create a demo user in auth.users
    - Insert 100 sample apartments with realistic data
    - Includes a mix of available, rented, and sold properties
    - Generates random prices, locations, and specifications
*/

-- First, create a demo user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  aud
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  'demo@example.com',
  '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12',
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  FALSE,
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;

DO $$
DECLARE
  i INTEGER;
  status_array apartment_status[] := ARRAY['available', 'rented', 'sold']::apartment_status[];
  title_prefix TEXT;
  street_names TEXT[] := ARRAY[
    'Main Street', 'Park Avenue', 'Broadway', 'Oak Lane', 'Maple Drive',
    'Cedar Court', 'Pine Road', 'Elm Street', 'Lake View', 'River Road'
  ];
  apartment_styles TEXT[] := ARRAY[
    'Modern', 'Luxury', 'Cozy', 'Spacious', 'Elegant',
    'Contemporary', 'Classic', 'Urban', 'Stylish', 'Premium'
  ];
  property_types TEXT[] := ARRAY[
    'Apartment', 'Condo', 'Loft', 'Studio', 'Penthouse'
  ];
BEGIN
  FOR i IN 1..100 LOOP
    -- Generate random title
    SELECT 
      apartment_styles[1 + floor(random() * array_length(apartment_styles, 1))] || ' ' ||
      property_types[1 + floor(random() * array_length(property_types, 1))] || ' on ' ||
      street_names[1 + floor(random() * array_length(street_names, 1))]
    INTO title_prefix;

    INSERT INTO apartments (
      title,
      description,
      price,
      address,
      latitude,
      longitude,
      bedrooms,
      bathrooms,
      area,
      images,
      status,
      user_id
    ) VALUES (
      title_prefix || ' #' || i,
      'Beautiful ' || lower(title_prefix) || ' with amazing views and modern amenities.',
      (random() * 4000 + 1000)::numeric(10,2),
      (1000 + floor(random() * 9000))::text || ' ' || 
      street_names[1 + floor(random() * array_length(street_names, 1))] || 
      ', New York, NY ' || (10000 + floor(random() * 100))::text,
      40.7128 + (random() * 0.1 - 0.05),
      -74.0060 + (random() * 0.1 - 0.05),
      1 + floor(random() * 4),
      1 + floor(random() * 3),
      (500 + floor(random() * 2000))::numeric(10,2),
      ARRAY['https://picsum.photos/800/600?random=' || i],
      status_array[1 + floor(random() * array_length(status_array, 1))],
      '00000000-0000-0000-0000-000000000000'  -- Use the demo user's ID
    );
  END LOOP;
END $$;