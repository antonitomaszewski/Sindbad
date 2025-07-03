-- users (Pocketbase)
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  created timestamp DEFAULT now(),
  updated timestamp DEFAULT now()
);

-- offers
CREATE TABLE offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date_from date,
  date_to date,
  location text,
  organizer_id uuid REFERENCES users(id),
  contact text,
  created timestamp DEFAULT now(),
  updated timestamp DEFAULT now()
);