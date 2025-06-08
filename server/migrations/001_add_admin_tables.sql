-- Drop existing tables if they exist (in correct order to handle dependencies)
DROP TABLE IF EXISTS payment_logs CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contacts Table
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Transactions Table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  reference VARCHAR(100) NOT NULL UNIQUE,
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NGN',
  status VARCHAR(20) NOT NULL,
  service_id VARCHAR(50),
  service_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(100) NOT NULL,
  metadata JSON,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT NOT NULL,
  project_type TEXT,
  budget VARCHAR(50),
  timeline TEXT,
  message TEXT,
  payment_status VARCHAR(20) DEFAULT 'pending',
  transaction_id INTEGER REFERENCES transactions(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  transaction_id INTEGER REFERENCES transactions(id),
  status VARCHAR(20) DEFAULT 'pending',
  customer_email VARCHAR(100) NOT NULL,
  service_id VARCHAR(50),
  service_name VARCHAR(100) NOT NULL,
  booking_id INTEGER REFERENCES bookings(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin Users Table (with proper constraints)
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

-- Site Settings Table
CREATE TABLE site_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT,
  category VARCHAR(50) DEFAULT 'general',
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inquiries Table
CREATE TABLE inquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects Table for project management
CREATE TABLE projects (
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

-- Payment Logs Table
CREATE TABLE payment_logs (
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

-- Create additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference);
CREATE INDEX IF NOT EXISTS idx_payment_logs_booking_id ON payment_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);