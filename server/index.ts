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

// Run database migrations
async function runMigrations() {
  try {
    const migrationPath = path.join(__dirname, 'migrations', '001_add_admin_tables.sql');
    if (fs.existsSync(migrationPath)) {
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      await pool.query(migrationSQL);
      console.log('Database migrations completed successfully');
    } else {
      // Optional: Log if migration file is not found, could be normal if no migrations yet
      console.log('Migration file not found, skipping migrations:', migrationPath);
    }
  } catch (error) {
    console.error('Migration error:', error);
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path; // Renamed to avoid conflict with 'path' module if used in broader scope
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