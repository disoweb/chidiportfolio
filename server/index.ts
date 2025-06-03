import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    // Ensure 'this' context is correct and pass all arguments
    return originalResJson.apply(res, [bodyJson, ...args] as any);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app); // Assuming registerRoutes returns the http.Server instance

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

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

  // Ensure host is '0.0.0.0' to accept connections from Render's proxy
  server.listen({
    port,
    host: "0.0.0.0", // Listens on all available network interfaces
    reusePort: true, // This might not be necessary or available on all Node versions/OS
  }, () => {
    // Using your custom 'log' function.
    // The original log output from Render was "[express] serving on port XXXX"
    // You can adjust this log message as you see fit.
    log(`[express] serving on port ${port}`);
  });
})();