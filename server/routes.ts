import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";
import { Request, Response } from 'express';
import axios from 'axios';

// In-memory storage for demo (replace with database in production)
let inquiries: any[] = [];
let adminUsers = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // In production, this should be hashed
    email: 'admin@chidiogara.com',
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

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
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const context = `You are Chidi Ogara's AI assistant. Respond as Chidi himself using "I", "my", "me". Be concise, smart, and straight to the point while maintaining professionalism.

ABOUT ME:
I'm Chidi Ogara, a Senior Fullstack Developer with 7+ years building scalable web applications. I transform business ideas into robust digital solutions using modern technologies.

CORE EXPERTISE:
• Frontend: React, Next.js, TypeScript, Tailwind CSS
• Backend: Node.js, Express, PHP, Laravel, Python
• Database: PostgreSQL, MySQL, MongoDB
• DevOps: AWS, Docker, Git, CI/CD
• Specialties: API development, real-time apps, e-commerce

SERVICES I OFFER:
1. Full-stack web development
2. API development & integration
3. Database design & optimization
4. Performance optimization
5. Code audits & consulting

RESPONSE GUIDELINES:
- Be direct and actionable
- Provide specific technical insights
- Reference relevant experience when appropriate
- Always offer to discuss their project in detail
- Include estimated timelines when discussing services
- Mention free consultation for serious inquiries

PRICING CONTEXT:
- Simple websites: $500-2000
- Complex web apps: $2000-8000
- API development: $800-3000
- Consulting: $50-100/hour
- Always offer free initial consultation

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

Instructions:
- Answer as Chidi Ogara in first person
- Be concise and direct (2-3 sentences max unless complex question)
- Provide specific technical details when relevant
- Include pricing estimates when appropriate
- Always end with a call-to-action
- Use my experience to build credibility

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

  // Admin login endpoint
  app.post('/api/admin/login', (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      const admin = adminUsers.find(user => 
        user.username === username && user.password === password
      );

      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // In production, use proper JWT tokens
      res.json({ 
        success: true, 
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        },
        token: 'mock-jwt-token'
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  });

  // Get admin credentials (for development only)
  app.get('/api/admin/credentials', (req: Request, res: Response) => {
    res.json({
      username: 'admin',
      password: 'admin123',
      note: 'Default admin credentials for development'
    });
  });

  // Seed admin account endpoint
  app.post('/api/seed-admin', async (req, res) => {
    try {
      // Create admin user with credentials
      const adminUser = {
        id: '1',
        username: 'admin',
        email: 'admin@chidiogara.dev',
        password: 'Admin123!', // In production, this should be hashed
        role: 'admin',
        createdAt: new Date().toISOString()
      };

      res.json({ 
        message: 'Admin account seeded successfully',
        credentials: {
          username: adminUser.username,
          email: adminUser.email,
          password: adminUser.password
        }
      });
    } catch (error) {
      console.error('Error seeding admin:', error);
      res.status(500).json({ error: 'Failed to seed admin account' });
    }
  });

  // Paystack payment initiation endpoint
  app.post('/api/paystack/initiate', async (req: Request, res: Response) => {
    try {
      const { email, amount, serviceId, serviceName, bookingId } = req.body;

      if (!email || !amount || !serviceId || !serviceName) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: email, amount, serviceId, serviceName'
        });
      }

      if (!process.env.PAYSTACK_SECRET_KEY) {
        return res.status(500).json({
          success: false,
          message: 'Payment configuration error'
        });
      }

      const paystackResponse = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email,
          amount: amount * 100, // convert to kobo
          metadata: {
            service_id: serviceId,
            service_name: serviceName,
            booking_id: bookingId
          },
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000'}/payment/callback`
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      res.json({
        success: true,
        data: paystackResponse.data.data
      });

    } catch (error: any) {
      if (error.response) {
        return res.status(error.response.status || 400).json({
          success: false,
          message: error.response.data?.message || 'Paystack API error'
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Payment initiation failed'
      });
    }
  });

  // Paystack payment verification endpoint
  app.post('/api/paystack/verify', async (req: Request, res: Response) => {
    if (!process.env.PAYSTACK_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: Paystack secret key not found.'
      });
    }

    const { reference, service: clientService, amount: clientAmount } = req.body;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Reference is required'
      });
    }

    try {
      // Step 1: Verify with Paystack
      const paystackResponse = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        }
      );

      const paystackTransactionDetails = paystackResponse.data.data;

      if (!paystackTransactionDetails || paystackResponse.data.status === false) {
        return res.status(400).json({
          success: false,
          message: paystackResponse.data.message || 'Failed to verify transaction with Paystack.'
        });
      }

      if (paystackTransactionDetails.status !== 'success') {
        return res.status(400).json({
          success: false,
          message: `Payment not successful. Status: ${paystackTransactionDetails.status}`
        });
      }

      // Step 2: Verify amount matches
      if (clientAmount && (paystackTransactionDetails.amount / 100 !== clientAmount)) {
        console.warn(`Amount mismatch for reference ${reference}. Expected: ${clientAmount}, Got: ${paystackTransactionDetails.amount / 100}`);
        return res.status(400).json({
          success: false,
          message: 'Amount mismatch after verification.'
        });
      }

      // Step 3: Return success response
      res.json({
        success: true,
        message: 'Payment verified and processed successfully.',
        data: {
          reference: paystackTransactionDetails.reference,
          amount: paystackTransactionDetails.amount / 100,
          service: paystackTransactionDetails.metadata?.service_name || clientService || 'Unknown Service',
          customerEmail: paystackTransactionDetails.customer?.email,
        }
      });

    } catch (error: any) {
      console.error('Payment verification process error:', error);

      if (error.response) {
        return res.status(error.response.status || 400).json({
          success: false,
          message: error.response.data?.message || 'Error verifying payment with Paystack.'
        });
      }

      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred during payment verification.'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}