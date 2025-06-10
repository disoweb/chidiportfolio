
-- Reset admin password to ensure proper hashing
DELETE FROM admin_users WHERE username = 'admin';

-- Recreate admin with proper password hash
-- Password: admin123 hashed with bcrypt
INSERT INTO admin_users (username, email, password, role, is_active, created_at, updated_at)
VALUES (
  'admin', 
  'admin@chidiogara.dev', 
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewPh0aQQ95Z8xOy6', 
  'admin', 
  true, 
  NOW(), 
  NOW()
);
