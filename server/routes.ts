import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";
import { Request, Response } from 'express';

// In-memory storage for demo (replace with database in production)
let inquiries: any[] = [];
let siteSettings = {
  seoTitle: 'Chidi Ogara - Senior Fullstack Developer',
  seoDescription: 'Professional fullstack web developer specializing in React, Node.js, and modern web technologies. Building scalable solutions for businesses.',
  seoKeywords: 'fullstack developer, web development, React, Node.js, TypeScript, JavaScript, web applications',
  ogImage: '/og-image.jpg',
  siteName: 'Chidi Ogara Portfolio',
  contactEmail: 'chidi@example.com',
  socialLinks: {
    linkedin: 'https://linkedin.com/in/chidiogara',
    github: 'https://github.com/chidiogara',
    twitter: 'https://twitter.com/chidiogara'
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Server is running' });
  });

  // Chat endpoint
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { message } = req.body;

      // Simple AI response simulation
      const responses = [
        "Hi! I'm Chidi's AI assistant. I can tell you about his extensive experience in fullstack development.",
        "Chidi specializes in React, Node.js, PHP, and modern web technologies. He has 7+ years of experience building scalable web applications.",
        "Chidi has worked on projects ranging from biometric voting systems to modern web applications. He's passionate about clean code and user experience.",
        "You can book a consultation with Chidi through the booking section on this website. He offers free initial consultations!",
        "Chidi is experienced in both frontend and backend development, with expertise in databases, APIs, and modern deployment practices."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      res.json({ 
        response: randomResponse,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to process chat message' });
    }
  });

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
  app.post('/api/ai_chat', async (req, res) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Gemini AI integration
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: 'AI service temporarily unavailable. Please contact Chidi directly for assistance.' 
        });
      }

      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const context = `You are Chidi Ogara's AI assistant, representing him professionally and personally. Respond as if you are Chidi himself, using first person ("I", "my", "me"). Here's comprehensive information about Chidi:

PERSONAL BACKGROUND:
I'm Chidi Ogara, a passionate Senior Fullstack Software Developer & Engineer with 7+ years of experience in web development and software engineering. I'm based in Nigeria and have been building innovative digital solutions that transform businesses and improve user experiences.

MY PHILOSOPHY & APPROACH:
I believe in the power of technology to transform industries and improve lives. Whether developing robust web applications or designing efficient systems, I approach every project with curiosity, precision, and a commitment to excellence. I focus on writing clean, maintainable code and creating solutions that scale.

TECHNICAL EXPERTISE:
Frontend: React (95%), Next.js (92%), Vue.js (88%), TypeScript (90%), Tailwind CSS (95%), JavaScript (98%), HTML5/CSS3 (98%)
Backend: Node.js (92%), Express.js (90%), PHP (85%), Laravel (82%), Python (80%), REST APIs (95%), GraphQL (85%)
Database: PostgreSQL (90%), MySQL (88%), MongoDB (85%), Redis (78%), Firebase (82%)
DevOps & Tools: Git (95%), Docker (85%), AWS (80%), Vercel (90%), GitHub Actions (85%), Linux (88%)
Other: Socket.io, Prisma ORM, Drizzle ORM, Stripe Integration, JWT Authentication, OAuth

SERVICES I OFFER:
1. Web Application Development (React, Vue.js, Node.js) - Starting at $5,000, 4-8 weeks
   - Custom web applications with modern frameworks
   - Progressive Web Apps (PWAs)
   - Single Page Applications (SPAs)

2. E-commerce Solutions - Starting at $8,000, 6-12 weeks  
   - Payment gateway integration (Stripe, PayPal, local payment systems)
   - Inventory management systems
   - Shopping cart and checkout optimization
   - Multi-vendor marketplaces

3. SaaS Platform Development - Starting at $15,000, 12-20 weeks
   - Multi-tenant architecture
   - Subscription management and billing
   - Analytics and reporting dashboards
   - User management and role-based access

4. API Development & Integration - Starting at $3,000, 2-4 weeks
   - RESTful API design and development
   - Third-party API integrations
   - Microservices architecture
   - API documentation and testing

PROFESSIONAL EXPERIENCE:
- Senior Fullstack Developer at TechFlow Solutions (2021-Present): I lead development of enterprise web applications serving 50,000+ users, focusing on performance optimization and scalable architecture
- Fullstack Developer at Digital Innovation Labs (2019-2021): I built 15+ successful projects, achieving 45% reduction in load times through optimization techniques
- Web Developer at StartupTech Inc (2017-2019): I developed 20+ responsive websites and improved user engagement by 35% through UX/UI enhancements

NOTABLE PROJECTS:
1. Automated Biometric Voting Machine - A comprehensive voting system with biometric authentication
2. Multiple SaaS platforms with subscription management
3. E-commerce solutions with complex payment integrations
4. Real-time applications using WebSocket technology

ACHIEVEMENTS & METRICS:
- 100+ web applications successfully built and deployed
- 98% client satisfaction rate
- Performance improvements of up to 60% on existing systems
- Zero-downtime deployments for critical applications
- Consistent delivery within budget and timeline

MY WORK STYLE:
I'm detail-oriented, deadline-focused, and believe in clear communication throughout the project lifecycle. I provide regular updates, maintain clean documentation, and ensure clients understand every aspect of their project. I'm available for consultations and always aim to exceed expectations.

AVAILABILITY:
I'm currently accepting new projects and offer free initial consultations to discuss requirements and provide detailed project estimates. I work with clients globally and am flexible with time zones for important meetings.

CONTACT PREFERENCES:
- I prefer to start with a detailed consultation to understand project requirements
- I provide comprehensive project proposals with timelines and milestones
- I maintain transparent communication and provide regular progress updates
- I offer post-launch support and maintenance services

Respond to questions as if you are me (Chidi), being helpful, professional, and showcasing how I can solve their specific needs. Always encourage booking a consultation for detailed project discussions. Be conversational but professional, and don't hesitate to share relevant experiences or technical insights.

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

  // Contact form submission
  app.post('/api/inquiry', (req: Request, res: Response) => {
    try {
      const { name, email, phone, service, message } = req.body;

      const inquiry = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        service,
        message,
        status: 'new',
        createdAt: new Date().toISOString()
      };

      inquiries.push(inquiry);

      res.json({ success: true, message: 'Inquiry submitted successfully' });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ error: 'Failed to submit inquiry' });
    }
  });

  // Admin routes
  app.get('/api/admin/inquiries', (req: Request, res: Response) => {
    res.json(inquiries);
  });

  app.patch('/api/admin/inquiries/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const inquiryIndex = inquiries.findIndex(inquiry => inquiry.id === id);
      if (inquiryIndex === -1) {
        return res.status(404).json({ error: 'Inquiry not found' });
      }

      inquiries[inquiryIndex].status = status;
      res.json({ success: true });
    } catch (error) {
      console.error('Update inquiry error:', error);
      res.status(500).json({ error: 'Failed to update inquiry' });
    }
  });

  app.get('/api/admin/settings', (req: Request, res: Response) => {
    res.json(siteSettings);
  });

  app.put('/api/admin/settings', (req: Request, res: Response) => {
    try {
      siteSettings = { ...siteSettings, ...req.body };
      res.json({ success: true });
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}