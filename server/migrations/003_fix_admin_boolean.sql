
-- Fix admin users table to use proper boolean type
ALTER TABLE admin_users ALTER COLUMN is_active TYPE BOOLEAN USING 
  CASE 
    WHEN is_active = 'true' OR is_active = 't' OR is_active = '1' THEN true
    ELSE false
  END;

-- Set default value
ALTER TABLE admin_users ALTER COLUMN is_active SET DEFAULT true;

-- Ensure all active admins are properly set
UPDATE admin_users SET is_active = true WHERE username = 'admin';
