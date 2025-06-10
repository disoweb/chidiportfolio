
-- Messages Table - for communication between admin and clients
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  sender_id INTEGER,
  sender_type VARCHAR(10) NOT NULL,
  recipient_id INTEGER,
  recipient_type VARCHAR(10) NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  attachments JSON,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications Table - for system notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  admin_user_id INTEGER REFERENCES admin_users(id),
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  data JSON,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Project Updates Table - for tracking project progress updates
CREATE TABLE IF NOT EXISTS project_updates (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) NOT NULL,
  updated_by INTEGER REFERENCES admin_users(id) NOT NULL,
  update_type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  old_value TEXT,
  new_value TEXT,
  attachments JSON,
  is_visible_to_client BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Team Members Table - for managing team roles and permissions
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  admin_user_id INTEGER REFERENCES admin_users(id) NOT NULL,
  role VARCHAR(50) DEFAULT 'team_member',
  permissions JSON,
  department_id INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Departments Table - for organizing team members
CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  manager_id INTEGER REFERENCES admin_users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Client Sessions Table - for managing client login sessions
CREATE TABLE IF NOT EXISTS client_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id, recipient_type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_admin_user_id ON notifications(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_project_id ON project_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_team_members_admin_user_id ON team_members(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_client_sessions_user_id ON client_sessions(user_id);
