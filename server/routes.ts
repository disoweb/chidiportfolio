import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertBookingSchema } from "@shared/schema";
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

  // Booking form submission endpoint
  app.post('/api/booking', async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      
      res.json({ 
        success: true, 
        message: 'Booking submitted successfully',
        id: booking.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: 'Validation error', 
          details: error.errors 
        });
      } else {
        console.error('Booking error:', error);
        res.status(500).json({ 
          error: 'Internal server error' 
        });
      }
    }
  });

  // Get all bookings (for admin purposes)
  app.get('/api/bookings', async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      console.error('Get bookings error:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  });

  // AI Chat endpoint using Gemini
  app.post('/api/chat', async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Gemini AI integration
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const context = `You are an AI assistant representing Chidi Ogara, a senior fullstack web developer with 7+ years of experience. Here's information about Chidi:

SERVICES:
- Web Application Development (React, Vue.js, Node.js) - Starting at $5,000, 4-8 weeks
- E-commerce Solutions (Payment integration, inventory management) - Starting at $8,000, 6-12 weeks  
- SaaS Platform Development (Multi-tenant, subscriptions, analytics) - Starting at $15,000, 12-20 weeks
- API Development & Integration (REST APIs, third-party integrations) - Starting at $3,000, 2-4 weeks

SKILLS:
Frontend: React (95%), Next.js (92%), Vue.js (88%), TypeScript (90%), Tailwind CSS (95%), JavaScript (98%)
Backend: Node.js (92%), Express.js (90%), PHP (85%), Laravel (82%), Python (80%), REST APIs (95%)
Database: PostgreSQL (90%), MySQL (88%), MongoDB (85%), Redis (78%)
Tools: Git (95%), Docker (85%), AWS (80%), Vercel (90%), GitHub Actions (85%)

EXPERIENCE:
- Senior Fullstack Developer at TechFlow Solutions (2021-Present): Led development of enterprise web applications serving 50,000+ users
- Fullstack Developer at Digital Innovation Labs (2019-2021): Built 15+ successful projects, reduced load times by 45%
- Web Developer at StartupTech Inc (2017-2019): Built 20+ responsive websites, improved user engagement by 35%

ACHIEVEMENTS:
- 100+ web applications built
- 98% client satisfaction rate
- Performance improvements up to 60%

Be helpful, professional, and focus on how Chidi can help with web development projects. Always encourage booking a consultation for detailed discussions.

User question: ${message}`;

      const result = await model.generateContent(context);
      const response = result.response;
      const text = response.text();

      res.json({ response: text });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ 
        error: 'Failed to process chat message',
        details: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
