import bcrypt from 'bcryptjs';
import { storage } from './storage';
import { pool } from './db';

/**
 * Database seeding script that runs on server startup
 * Creates essential admin and client accounts
 */
export async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    // Seed admin users
    await seedAdminUsers();
    
    // Seed client users
    await seedClientUsers();
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Database seeding failed:', error);
  }
}

async function seedAdminUsers() {
  const adminUsers = [
    {
      username: 'admin',
      email: 'admin@chidiogara.dev', 
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'super_admin' as const
    },
    {
      username: 'manager',
      email: 'manager@chidiogara.dev',
      password: 'manager123', 
      firstName: 'Manager',
      lastName: 'User',
      role: 'admin' as const
    }
  ];

  for (const adminData of adminUsers) {
    try {
      // Check if admin already exists
      const existingAdmin = await storage.getAdminByEmail(adminData.email);
      if (existingAdmin) {
        console.log(`Admin ${adminData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = bcrypt.hashSync(adminData.password, 10);

      // Create admin user
      await storage.createAdminUser({
        username: adminData.username,
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role
      });

      console.log(`✅ Created admin: ${adminData.username} (${adminData.email})`);
    } catch (error) {
      console.error(`Failed to create admin ${adminData.email}:`, error);
    }
  }
}

async function seedClientUsers() {
  const clientUsers = [
    {
      email: 'c2@gmail.com',
      password: 'password123',
      firstName: 'Client',
      lastName: 'User',
      phone: '+1234567890',
      username: 'c2user'
    },
    {
      email: 'client1@example.com', 
      password: 'Client123!',
      firstName: 'Test',
      lastName: 'Client',
      phone: '+1234567891',
      username: 'client1'
    },
    {
      email: 'client2@example.com',
      password: 'Client456!', 
      firstName: 'Demo',
      lastName: 'User',
      phone: '+1234567892',
      username: 'client2'
    }
  ];

  for (const clientData of clientUsers) {
    try {
      // Check if client already exists
      const existingResult = await pool.query('SELECT id FROM users WHERE email = $1', [clientData.email]);
      if (existingResult.rows.length > 0) {
        console.log(`Client ${clientData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = bcrypt.hashSync(clientData.password, 10);

      // Create client user using direct SQL
      await pool.query(`
        INSERT INTO users (email, first_name, last_name, phone, password, username, created_at, updated_at, is_active, email_verified) 
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), true, true)
      `, [
        clientData.email,
        clientData.firstName,
        clientData.lastName,
        clientData.phone,
        hashedPassword,
        clientData.username
      ]);

      console.log(`✅ Created client: ${clientData.email}`);
    } catch (error) {
      console.error(`Failed to create client ${clientData.email}:`, error);
    }
  }
}

/**
 * Create sample data for demonstration purposes
 */
export async function seedSampleData() {
  try {
    console.log('Creating sample booking and project data...');
    
    // Create a sample booking for c2@gmail.com
    const booking = await storage.createBooking({
      name: 'Client User',
      email: 'c2@gmail.com',
      phone: '+1234567890',
      service: 'Private Consultation',
      projectType: 'Web Development',
      budget: '5000-10000',
      timeline: '1-2 months',
      message: 'Sample consultation booking for demonstration'
    });

    // Create a sample project linked to the booking
    const project = await storage.createProject({
      bookingId: booking.id,
      name: 'Private Consultation Project',
      description: 'Web Development consultation for client',
      clientEmail: 'c2@gmail.com',
      status: 'planning',
      budget: '5000-10000',
      estimatedTime: 40,
      notes: 'Sample project for demonstration'
    });

    // Create a sample payment log
    await storage.createPaymentLog({
      bookingId: booking.id,
      projectId: project.id,
      amount: '750.00',
      status: 'completed',
      reference: `demo_payment_${Date.now()}`,
      customerEmail: 'c2@gmail.com',
      serviceName: 'Private Consultation'
    });

    console.log('✅ Sample data created successfully');
  } catch (error) {
    console.error('Failed to create sample data:', error);
  }
}