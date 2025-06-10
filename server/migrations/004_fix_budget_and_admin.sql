
-- Fix budget column type in projects table
ALTER TABLE projects ALTER COLUMN budget TYPE TEXT;

-- Ensure admin users table exists with correct structure
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  is_active VARCHAR(10) DEFAULT 'true',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create default admin user if none exists
INSERT INTO admin_users (username, email, password, role, is_active)
VALUES ('admin', 'admin@chidiogara.dev', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewPh0aQQ95Z8xOy6', 'admin', 'true')
ON CONFLICT (username) DO NOTHING;
