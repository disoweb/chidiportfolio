
-- Add projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  name TEXT NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'planning',
  priority VARCHAR(10) DEFAULT 'medium',
  progress INTEGER DEFAULT 0,
  start_date TIMESTAMP,
  due_date TIMESTAMP,
  completed_date TIMESTAMP,
  assigned_to TEXT DEFAULT 'Chidi Ogara',
  client_email TEXT NOT NULL,
  budget NUMERIC(10, 2),
  time_spent INTEGER DEFAULT 0,
  estimated_time INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add payment logs table
CREATE TABLE IF NOT EXISTS payment_logs (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  project_id INTEGER REFERENCES projects(id),
  transaction_id INTEGER REFERENCES transactions(id),
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NGN',
  payment_method VARCHAR(50) DEFAULT 'paystack',
  status VARCHAR(20) NOT NULL,
  reference VARCHAR(100) NOT NULL,
  customer_email VARCHAR(100) NOT NULL,
  service_name VARCHAR(100) NOT NULL,
  project_details JSON,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_booking_id ON projects(booking_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_payment_logs_booking_id ON payment_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_reference ON payment_logs(reference);
