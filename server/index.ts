import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { createServer } from "http";
import { pool } from "./db";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Run database migrations and seed admin
async function runMigrations() {
  try {
    const migrationPath = path.join(__dirname, 'migrations', '001_add_admin_tables.sql');
    if (fs.existsSync(migrationPath)) {
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      await pool.query(migrationSQL);
      console.log('Database migrations completed successfully');
    } else {
      console.log('Migration file not found, skipping migrations:', migrationPath);
    }

    // Also run the project management migration
    const projectMigrationPath = path.join(__dirname, 'migrations', '002_add_project_management.sql');
    if (fs.existsSync(projectMigrationPath)) {
      const projectMigrationSQL = fs.readFileSync(projectMigrationPath, 'utf8');
      await pool.query(projectMigrationSQL);
      console.log('Project management migration completed successfully');
    }

    // Auto-seed admin user
    await seedAdminUser();
  } catch (error) {
    console.error('Migration error:', error);
  }
}

// Function to ensure admin user exists
async function seedAdminUser() {
  try {
    const bcrypt = await import('bcryptjs');
    
    // Use a transaction to ensure atomicity
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Admin accounts to create
      const adminAccounts = [
        {
          username: 'admin',
          email: 'admin@chidiogara.dev',
          password: 'AdminPass123!',
          role: 'admin',
          firstName: 'Admin',
          lastName: 'User'
        },
        {
          username: 'manager',
          email: 'manager@chidiogara.dev',
          password: 'ManagerPass123!',
          role: 'manager',
          firstName: 'Project',
          lastName: 'Manager'
        }
      ];

      // Regular user accounts to create
      const userAccounts = [
        {
          username: 'client1',
          email: 'client1@example.com',
          password: 'Client123!',
          firstName: 'John',
          lastName: 'Smith'
        },
        {
          username: 'client2',
          email: 'client2@example.com',
          password: 'Client456!',
          firstName: 'Jane',
          lastName: 'Doe'
        }
      ];

      // Create admin accounts
      for (const admin of adminAccounts) {
        const checkAdminQuery = 'SELECT id, username, email FROM admin_users WHERE username = $1';
        const existingAdmin = await client.query(checkAdminQuery, [admin.username]);
        
        if (existingAdmin.rows.length === 0) {
          const hashedPassword = await bcrypt.default.hash(admin.password, 12);
          const insertAdminQuery = `
            INSERT INTO admin_users (username, email, password, role, is_active, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
            RETURNING id, username, email, role
          `;
          
          const newAdmin = await client.query(insertAdminQuery, [
            admin.username,
            admin.email,
            hashedPassword,
            admin.role,
            true
          ]);
          
          console.log(`Admin account created: ${admin.username} (${admin.email}) - Password: ${admin.password}`);
        } else {
          // Update existing admin password
          const hashedPassword = await bcrypt.default.hash(admin.password, 12);
          const updateAdminQuery = `
            UPDATE admin_users 
            SET password = $1, is_active = $2, updated_at = NOW()
            WHERE username = $3
            RETURNING id, username, email, role
          `;
          
          await client.query(updateAdminQuery, [hashedPassword, true, admin.username]);
          console.log(`Admin account updated: ${admin.username} (${admin.email}) - Password: ${admin.password}`);
        }
      }

      // Create regular user accounts (skip for now until table is fixed)
      console.log('Skipping user account creation until table structure is fixed by migrations');
      
      await client.query('COMMIT');
      console.log('\n=== ACCOUNT SUMMARY ===');
      console.log('ADMIN ACCOUNTS:');
      console.log('1. Username: admin, Email: admin@chidiogara.dev, Password: AdminPass123!');
      console.log('2. Username: manager, Email: manager@chidiogara.dev, Password: ManagerPass123!');
      console.log('\nUSER ACCOUNTS:');
      console.log('1. Username: client1, Email: client1@example.com, Password: Client123!');
      console.log('2. Username: client2, Email: client2@example.com, Password: Client456!');
      console.log('========================\n');
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error seeding accounts:', error);
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path; 
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (this: Response, bodyJson: any, ...args: any[]) { // Added 'this' type and 'any' for bodyJson
    capturedJsonResponse = bodyJson;
    // Ensure 'this' context is correct and pass all arguments
    return originalResJson.apply(this, [bodyJson, ...args] as any); // 'this' instead of 'res'
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        try {
          const jsonResponseString = JSON.stringify(capturedJsonResponse);
          logLine += ` :: ${jsonResponseString}`;
        } catch (e) {
          logLine += ` :: [Unserializable JSON response]`;
        }
      }

      if (logLine.length > 200) { // Increased limit for more useful logs
        logLine = logLine.slice(0, 199) + "…";
      }

      console.log(logLine); // CORRECTED: Was 'log(logLine);'
    }
  });

  next();
});

(async () => {

  await runMigrations();

  const server = await registerRoutes(app); // Assuming registerRoutes returns the http.Server instance

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log the error details on the server for debugging
    console.error(`Error ${status}: ${message}`, err.stack || err);

    res.status(status).json({ message });
    // It's generally not recommended to re-throw the error here
    // as it might crash the process if not caught by a higher-level handler,
    // and the response has already been sent.
    // Consider logging it instead if not already handled:
    // console.error("Unhandled error:", err);
    // throw err; // Commented out as per common practice
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use the PORT environment variable provided by Render (or other platforms)
  // Fallback to 5000 for local development if PORT is not set.
  const portFromEnv = process.env.PORT;
  const port = portFromEnv ? parseInt(portFromEnv, 10) : 5000;

  if (isNaN(port)) {
    console.error(`Invalid PORT environment variable: ${portFromEnv}. Defaulting to 5000.`);
    // port = 5000; // Already handled by the ternary, but an explicit log is good.
  }

  // Ensure host is '0.0.0.0' to accept connections from Render's proxy
  server.listen({
    port,
    host: "0.0.0.0", // Listens on all available network interfaces
    // reusePort: true, // This might not be necessary or available on all Node versions/OS. Evaluate if needed.
  }, () => {
    // Using your custom 'log' function.
    // The original log output from Render was "[express] serving on port XXXX"
    // You can adjust this log message as you see fit.
    console.log(`[express] serving on port ${port}`); // CORRECTED: Was 'log(...);'
  });
})();