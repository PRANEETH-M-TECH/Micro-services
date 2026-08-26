-- Communa capstone schema (doc §5)
-- Runs automatically on first Postgres container start (mounted into /docker-entrypoint-initdb.d/)

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  flat_no VARCHAR(20) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('consumer', 'seller', 'admin')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS sellers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  title VARCHAR(160) NOT NULL,
  description TEXT NOT NULL,
  price_range VARCHAR(80),
  contact_number VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_actions (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES users(id),
  target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('user', 'seller')),
  target_id INTEGER NOT NULL,
  action VARCHAR(20) NOT NULL CHECK (action IN ('approve', 'reject')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sellers_category ON sellers(category_id);
CREATE INDEX IF NOT EXISTS idx_sellers_status ON sellers(status);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

INSERT INTO categories (name) VALUES
  ('Food'),
  ('Clothing'),
  ('Essentials'),
  ('Additional Services'),
  ('Tuitions')
ON CONFLICT (name) DO NOTHING;
