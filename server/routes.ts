import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertContactSchema.parse(req.body);
      
      // Store contact submission
      const contact = await storage.createContact(validatedData);
      
      // In a real implementation, you would send an email notification here
      // Example: await sendEmailNotification(validatedData);
      
      res.json({ 
        success: true, 
        message: 'Contact form submitted successfully',
        id: contact.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: 'Validation error', 
          details: error.errors 
        });
      } else {
        console.error('Contact form error:', error);
        res.status(500).json({ 
          error: 'Internal server error' 
        });
      }
    }
  });

  // Get all contacts (for admin purposes)
  app.get('/api/contacts', async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      console.error('Get contacts error:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
