
-- Create missing tables for authentication and messaging system

-- Chat History Table
CREATE TABLE IF NOT EXISTS chat_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  session_id VARCHAR(255),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- User Registration Tokens (for email verification)
CREATE TABLE IF NOT EXISTS user_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  token VARCHAR(255) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL, -- 'verification', 'reset_password'
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Project Tracking Tokens (for anonymous users)
CREATE TABLE IF NOT EXISTS project_tracking_tokens (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  token VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_session_id ON chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_user_tokens_token ON user_tokens(token);
CREATE INDEX IF NOT EXISTS idx_user_tokens_user_id ON user_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_project_tracking_tokens_token ON project_tracking_tokens(token);
CREATE INDEX IF NOT EXISTS idx_project_tracking_tokens_project_id ON project_tracking_tokens(project_id);

-- Add missing columns to existing tables if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tracking_token VARCHAR(255) UNIQUE;

-- Update existing projects with tracking tokens
UPDATE projects 
SET tracking_token = 'PROJ-' || LPAD(id::text, 6, '0') || '-' || SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 8)
WHERE tracking_token IS NULL;
