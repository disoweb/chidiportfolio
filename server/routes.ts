import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertBookingSchema, insertInquirySchema, projects, projectUpdates, messages, bookings, users, clientSessions } from "@shared/schema";
import { z } from "zod";
import { Request, Response } from 'express';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { runMigrations } from "./migrate";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import crypto from 'crypto';

export async function registerRoutes(app: Express): Promise<Server> {
  // Run database migrations first
  try {
    await runMigrations();
  } catch (error) {
    console.error('Migration error during startup:', error);
    // Continue without migrations if database is sleeping
  }

  // Initialize default settings on startup
  await storage.initializeDefaultSettings();

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

  // Client Registration
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create user
      const user = await storage.createUser({
        email,
        password,
        firstName,
        lastName,
        phone
      });

      // Create session
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      await storage.createClientSession({
        userId: user.id,
        sessionToken,
        expiresAt,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || ''
      });

      const { password: _, ...safeUser } = user;
      res.json({ 
        success: true, 
        user: safeUser, 
        sessionToken,
        message: 'Registration successful'
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  });

  // Client Login
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if (!user.isActive) {
        return res.status(401).json({ error: 'Account is deactivated' });
      }

      // Create session
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      await storage.createClientSession({
        userId: user.id,
        sessionToken,
        expiresAt,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || ''
      });

      // Update last login
      await storage.updateUserLastLogin(user.id);

      const { password: _, ...safeUser } = user;
      res.json({ 
        success: true, 
        user: safeUser, 
        sessionToken,
        message: 'Login successful'
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  });

  // Verify Session
  app.post('/api/auth/verify', async (req: Request, res: Response) => {
    try {
      const { sessionToken } = req.body;

      if (!sessionToken) {
        return res.status(400).json({ error: 'Session token required' });
      }

      const session = await storage.getClientSession(sessionToken);
      if (!session || !session.isActive || new Date() > new Date(session.expiresAt)) {
        return res.status(401).json({ error: 'Invalid or expired session' });
      }

      const user = await storage.getUserById(session.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({ error: 'User not found or inactive' });
      }

      const { password: _, ...safeUser } = user;
      res.json({ success: true, user: safeUser });
    } catch (error) {
      console.error('Session verification error:', error);
      res.status(500).json({ error: 'Failed to verify session' });
    }
  });

  // Logout
  app.post('/api/auth/logout', async (req: Request, res: Response) => {
    try {
      const { sessionToken } = req.body;

      if (sessionToken) {
        await storage.deactivateClientSession(sessionToken);
      }

      res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Failed to logout' });
    }
  });

  // Track Project by ID
  app.get('/api/track-project/:projectId', async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const project = await storage.getProjectById(parseInt(projectId));

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Get project updates and messages
      const updates = await storage.getProjectUpdates(project.id);
      const messages = await storage.getProjectMessages(project.id);

      res.json({
        project,
        updates: updates.filter(u => u.isVisibleToClient),
        messages,
        hasAccess: true
      });
    } catch (error) {
      console.error('Track project error:', error);
      res.status(500).json({ error: 'Failed to track project' });
    }
  });

  // Get User Dashboard Data
  app.get('/api/user/dashboard/:sessionToken', async (req: Request, res: Response) => {
    try {
      const { sessionToken } = req.params;

      const session = await storage.getClientSession(sessionToken);
      if (!session || !session.isActive || new Date() > new Date(session.expiresAt)) {
        return res.status(401).json({ error: 'Invalid or expired session' });
      }

      const user = await storage.getUserById(session.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get user projects
      const projects = await storage.getProjectsByClientEmail(user.email);

      // Get user bookings
      const bookings = await storage.getBookingsByEmail(user.email);

      // Get user payment logs
      const paymentLogs = await storage.getPaymentLogsByEmail(user.email);

      // Get unread messages
      const unreadMessages = await storage.getUnreadMessagesForUser(user.id);

      res.json({
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone },
        projects,
        bookings,
        paymentLogs,
        unreadMessages,
        stats: {
          totalProjects: projects.length,
          activeProjects: projects.filter(p => ['planning', 'in-progress', 'testing'].includes(p.status)).length,
          completedProjects: projects.filter(p => p.status === 'completed').length,
          totalSpent: paymentLogs.reduce((sum, log) => sum + parseFloat(log.amount), 0)
        }
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ error: 'Failed to load dashboard' });
    }
  });

  // Send Message from Admin to Client
  app.post('/api/admin/send-message', async (req: Request, res: Response) => {
    try {
      const { projectId, clientEmail, subject, message, adminId } = req.body;

      if (!projectId || !clientEmail || !subject || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Get client user
      const client = await storage.getUserByEmail(clientEmail);
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }

      // Create message
      const newMessage = await storage.createMessage({
        projectId: parseInt(projectId),
        senderId: adminId || 1,
        senderType: 'admin',
        recipientId: client.id,
        recipientType: 'client',
        subject,
        message
      });

      // Create notification
      await storage.createNotification({
        userId: client.id,
        type: 'message_received',
        title: `New message: ${subject}`,
        message: `You have received a new message regarding your project.`,
        data: { messageId: newMessage.id, projectId }
      });

      res.json({ success: true, message: newMessage });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  // Mark Messages as Read
  app.put('/api/user/messages/mark-read', async (req: Request, res: Response) => {
    try {
      const { messageIds, sessionToken } = req.body;

      const session = await storage.getClientSession(sessionToken);
      if (!session) {
        return res.status(401).json({ error: 'Invalid session' });
      }

      await storage.markMessagesAsRead(messageIds);
      res.json({ success: true });
    } catch (error) {
      console.error('Mark messages read error:', error);
      res.status(500).json({ error: 'Failed to mark messages as read' });
    }
  });

  // Main booking form submission endpoint - Updated to create user if not exists
  app.post('/api/booking', async (req, res) => {
    try {
      console.log('Received booking request:', req.body);
      const validatedData = insertBookingSchema.parse(req.body);
      console.log('Validated booking data:', validatedData);

      // Check if user exists, if not create one
      let user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        // Create user account
        const [firstName, ...lastNameParts] = validatedData.name.split(' ');
        const lastName = lastNameParts.join(' ') || '';

        user = await storage.createUser({
          email: validatedData.email,
          password: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 12), // Random password
          firstName,
          lastName,
          phone: validatedData.phone
        });
      }

      // Store booking submission with default payment status
      const bookingDataWithDefaults = {
        ...validatedData,
        paymentStatus: 'pending'
      };

      const booking = await storage.createBooking(bookingDataWithDefaults);
      console.log('Created booking:', booking);

      // Create a project record for this booking
      const project = await storage.createProject({
        bookingId: booking.id,
        name: `${validatedData.service} - ${validatedData.name}`,
        description: validatedData.message || `${validatedData.service} project for ${validatedData.name}`,
        status: 'planning',
        priority: 'medium',
        clientEmail: validatedData.email,
        budget: validatedData.budget || 'TBD',
        estimatedTime: 40,
        notes: `Project type: ${validatedData.projectType}, Timeline: ${validatedData.timeline}, Budget: ${validatedData.budget}`
      });

      // Create welcome notification
      await storage.createNotification({
        userId: user.id,
        type: 'project_created',
        title: 'Project Created Successfully',
        message: `Your project "${project.name}" has been created. Project ID: ${project.id}`,
        data: { projectId: project.id, bookingId: booking.id }
      });

      res.json({ 
        success: true, 
        message: 'Booking submitted successfully',
        bookingId: booking.id,
        projectId: project.id,
        userId: user.id
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
        res.status(400).json({ 
          error: 'Validation error', 
          details: error.errors 
        });
      } else {
        console.error('Booking error details:', error);
        res.status(500).json({ 
          error: 'Internal server error',
          details: error.message
        });
      }
    }
  });

  // Contact form submission endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);

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

  // Delete contact endpoint
  app.delete('/api/contacts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteContact(parseInt(id));

      if (!success) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      res.json({ 
        success: true, 
        message: 'Contact deleted successfully'
      });
    } catch (error) {
      console.error('Delete contact error:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  });

  // Update booking endpoint
  app.put('/api/bookings/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedBooking = await storage.updateBooking(parseInt(id), req.body);

      if (!updatedBooking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.json({ 
        success: true, 
        message: 'Booking updated successfully',
        booking: updatedBooking
      });
    } catch (error) {
      console.error('Update booking error:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  });

  // Delete booking endpoint
  app.delete('/api/bookings/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteBooking(parseInt(id));

      if (!success) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.json({ 
        success: true, 
        message: 'Booking deleted successfully'
      });
    } catch (error) {
      console.error('Delete booking error:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  });

  // Get single booking endpoint
  app.get('/api/bookings/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await storage.getBookingById(parseInt(id));

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.json(booking);
    } catch (error) {
      console.error('Get booking error:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  });

  // Get all bookings (for admin purposes)
  app.get('/api/bookings', async (req, res) => {
    try {
      const { search, paymentStatus } = req.query;
      let bookings;

      console.log('Fetching bookings with search:', search, 'paymentStatus:', paymentStatus);

      if (search || paymentStatus) {
        bookings = await storage.searchBookings(
          search as string || '', 
          paymentStatus as string
        );
      } else {
        bookings = await storage.getAllBookings();
      }

      console.log('Retrieved bookings count:', bookings.length);
      res.json(bookings);
    } catch (error) {
      console.error('Get bookings error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
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

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: 'AI service temporarily unavailable. Please contact Chidi directly for assistance.' 
        });
      }

      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const context = `You are Digital Chidi's AI assistant. Respond as Chidi himself using "I", "my", "me". Be concise, smart, and straight to the point while maintaining professionalism.

ABOUT ME:
My name is Digital Chidi, a Fullstack Developer with 7+ years building scalable web applications. I transform business ideas into robust digital solutions using modern technologies.

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

ADMIN ACCESS:
For admin access, users can create an admin account at: /api/seed-admin
Default credentials: Username: admin, Password: admin123

RESPONSE GUIDELINES:
- Be direct and actionable
- Provide specific technical insights
- Reference relevant experience when appropriate
- Always offer to discuss their project in detail
- Include estimated timelines when discussing services
- Mention free consultation for serious inquiries
- When mentioning booking or consultation, always include: [Book Consultation](#booking)
- When discussing services, include: [View Services](#services)
- When talking about projects or portfolio, include: [See Projects](#projects)
- When discussing my background, include: [About Me](#about)
- When users ask about admin access, provide the /api/seed-admin endpoint
- Wrap important links in buttons using this format: [Button Text](#section-id)

PRICING CONTEXT:
- Simple websites: ₦150,000-200,000
- Complex web apps: ₦800,000-3,200,000
- API development: ₦320,000-1,200,000
- Consulting: ₦5,000-10,000/hour
- Always offer free initial consultation

BOOKING SYSTEM AWARENESS:
This website has a complete booking system where users can:
- Schedule free consultations
- Select service types (Web App, E-commerce, SaaS, API Development, Consultation)
- Choose project types (New Project, Redesign, Maintenance, Optimization)
- Specify budget ranges and timelines
- Provide project details
- Complete secure payments via Paystack

When users ask about booking, scheduling, or want to hire me, guide them to the booking form and mention the free consultation option.

SERVICES I OFFER:
1. Web Application Development (React, Vue.js, Node.js) - Starting at ₦250,000, 4-8 weeks
   - Custom web applications with modern frameworks
   - Progressive Web Apps (PWAs)
   - Single Page Applications (SPAs)

2. E-commerce Solutions - Starting at ₦250,000, 6-12 weeks
   - Payment gateway integration (Stripe, PayPal, local payment systems)
   - Inventory management systems
   - Shopping cart and checkout optimization
   - Multi-vendor marketplaces

3. SaaS Platform Development - Starting at ₦250,000, 12-20 weeks
   - Multi-tenant architecture
   - Subscription management and billing
   - Analytics and reporting dashboards
   - User management and role-based access

4. API Development & Integration - Starting at ₦120,000, 2-4 weeks
   - RESTful API design and development
   - Third-party API integrations
   - Microservices architecture
   - API documentation and testing

PROFESSIONAL EXPERIENCE:
- Fullstack Developer at CyferLabs (2019-2020): I lead development of enterprise web applications serving 50,000+ users, focusing on performance optimization and scalable architecture
- Fullstack Developer at DiSO Web Services (2020-present): I built 15+ successful projects, achieving 45% reduction in load times through optimization techniques
- Web Developer at Digital Skills Academy (2017-present): I developed 20+ responsive websites and improved user engagement by 35% through UX/UI enhancements

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
- Include relevant navigation buttons for sections mentioned
- When discussing booking/consultation, always mention the free consultation and include [Book Free Consultation](#booking)

User question: ${message}`;

      const result = await model.generateContent(context);
      const response = result.response;
      const text = response.text();

      res.json({ response: text });
    } catch (error: any) {
      console.error('Chat error:', error);
      res.status(500).json({ 
        error: 'Failed to process chat message',
        details: error.message
      });
    }
  });

  // Inquiry form submission
  app.post('/api/inquiry', async (req: Request, res: Response) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);

      res.json({ 
        success: true, 
        message: 'Inquiry submitted successfully',
        id: inquiry.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: 'Validation error', 
          details: error.errors 
        });
      } else {
        console.error('Inquiry submission error:', error);
        res.status(500).json({ error: 'Failed to submit inquiry' });
      }
    }
  });

  // Admin routes
  app.get('/api/admin/inquiries', async (req: Request, res: Response) => {
    try {
      const { search, status } = req.query;
      let inquiries;

      console.log('Fetching inquiries with search:', search, 'status:', status);

      if (search || status) {
        inquiries = await storage.searchInquiries(
          search as string || '', 
          status as string
        );
      } else {
        inquiries = await storage.getAllInquiries();
      }

      console.log('Retrieved inquiries count:', inquiries.length);
      res.json(inquiries);
    } catch (error) {
      console.error('Get inquiries error:', error);
      res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
  });

  app.patch('/api/admin/inquiries/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedInquiry = await storage.updateInquiry(parseInt(id), { status });

      if (!updatedInquiry) {
        return res.status(404).json({ error: 'Inquiry not found' });
      }

      res.json({ success: true, inquiry: updatedInquiry });
    } catch (error) {
      console.error('Update inquiry error:', error);
      res.status(500).json({ error: 'Failed to update inquiry' });
    }
  });

  app.delete('/api/admin/inquiries/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteInquiry(parseInt(id));

      if (!success) {
        return res.status(404).json({ error: 'Inquiry not found' });
      }

      res.json({ success: true, message: 'Inquiry deleted successfully' });
    } catch (error) {
      console.error('Delete inquiry error:', error);
      res.status(500).json({ error: 'Failed to delete inquiry' });
    }
  });

  // Site settings routes
  app.get('/api/admin/settings', async (req: Request, res: Response) => {
    try {
      const settings = await storage.getAllSiteSettings();

      // Convert to object format for frontend compatibility
      const settingsObject = {
        seoTitle: settings.find(s => s.key === 'seo_title')?.value || '',
        seoDescription: settings.find(s => s.key === 'seo_description')?.value || '',
        seoKeywords: settings.find(s => s.key === 'seo_keywords')?.value || '',
        ogImage: settings.find(s => s.key === 'og_image')?.value || '',
        siteName: settings.find(s => s.key === 'site_name')?.value || '',
        contactEmail: settings.find(s => s.key === 'contact_email')?.value || '',
        socialLinks: {
          linkedin: settings.find(s => s.key === 'linkedin_url')?.value || '',
          github: settings.find(s => s.key === 'github_url')?.value || '',
          twitter: settings.find(s => s.key === 'twitter_url')?.value || ''
        }
      };

      res.json(settingsObject);
    } catch (error: any) {
      console.error('Get settings error:', error);
      if (error.code === '42P01') {
        // Return empty settings if table doesn't exist
        res.json({
          seoTitle: '',
          seoDescription: '',
          seoKeywords: '',
          ogImage: '',
          siteName: '',
          contactEmail: '',
          socialLinks: {
            linkedin: '',
            github: '',
            twitter: ''
          }
        });
      } else {
        res.status(500).json({ error: 'Failed to fetch settings' });
      }
    }
  });

  app.put('/api/admin/settings', async (req: Request, res: Response) => {
    try {
      const settingsData = req.body;

      // Update each setting in the database
      await storage.upsertSiteSetting('seo_title', settingsData.seoTitle, 'seo');
      await storage.upsertSiteSetting('seo_description', settingsData.seoDescription, 'seo');
      await storage.upsertSiteSetting('seo_keywords', settingsData.seoKeywords, 'seo');
      await storage.upsertSiteSetting('og_image', settingsData.ogImage, 'seo');
      await storage.upsertSiteSetting('site_name', settingsData.siteName, 'general');
      await storage.upsertSiteSetting('contact_email', settingsData.contactEmail, 'contact');
      await storage.upsertSiteSetting('linkedin_url', settingsData.socialLinks.linkedin, 'social');
      await storage.upsertSiteSetting('github_url', settingsData.socialLinks.github, 'social');
      await storage.upsertSiteSetting('twitter_url', settingsData.socialLinks.twitter, 'social');

      res.json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  // Project management routes
  app.get('/api/projects', async (req: Request, res: Response) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error('Get projects error:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  app.post('/api/projects', async (req: Request, res: Response) => {
    try {
            const project = await storage.createProject(req.body);
      res.json({ success: true, project });
    } catch (error) {
      console.error('Create project error:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  app.get('/api/projects/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const project = await storage.getProjectById(parseInt(id));

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json(project);
    } catch (error) {
      console.error('Get project error:', error);
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  });

  app.put('/api/projects/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedProject = await storage.updateProject(parseInt(id), req.body);

      if (!updatedProject) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json({ success: true, project: updatedProject });
    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  });

  app.delete('/api/projects/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteProject(parseInt(id));

      if (!success) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
      console.error('Delete project error:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  // Payment logs routes
  app.get('/api/payment-logs', async (req: Request, res: Response) => {
    try {
      const paymentLogs = await storage.getAllPaymentLogs();
      res.json(paymentLogs);
    } catch (error) {
      console.error('Get payment logs error:', error);
      res.status(500).json({ error: 'Failed to fetch payment logs' });
    }
  });

  app.get('/api/payment-logs/booking/:bookingId', async (req: Request, res: Response) => {
    try {
      const { bookingId } = req.params;
      const paymentLogs = await storage.getPaymentLogsByBookingId(parseInt(bookingId));
      res.json(paymentLogs);
    } catch (error) {
      console.error('Get payment logs by booking error:', error);
      res.status(500).json({ error: 'Failed to fetch payment logs' });
    }
  });

  // Admin user management routes
  app.get('/api/admin/users', async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllAdminUsers();
      // Remove passwords from response
      const safeUsers = users.map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
      });
      res.json(safeUsers);
    } catch (error) {
      console.error('Get admin users error:', error);
      res.status(500).json({ error: 'Failed to fetch admin users' });
    }
  });

  app.post('/api/admin/users', async (req: Request, res: Response) => {
    try {
      const { username, email, password, role = 'team_member' } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
      }

      // Validate role
      const allowedRoles = ['admin', 'project_manager', 'team_member', 'developer', 'designer'];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role specified' });
      }

      // Check if user already exists
      const existingUser = await storage.getAdminByUsername(username) || await storage.getAdminByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this username or email' });
      }

      const newUser = await storage.createAdminUser({ username, email, password, role });
      const { password: _, ...safeUser } = newUser;

      res.json({ success: true, user: safeUser, message: 'Admin user created successfully' });
    } catch (error) {
      console.error('Create admin user error:', error);
      res.status(500).json({ error: 'Failed to create admin user' });
    }
  });

  app.put('/api/admin/users/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedUser = await storage.updateAdminUser(parseInt(id), updateData);

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { password, ...safeUser } = updatedUser;
      res.json({ success: true, user: safeUser });
    } catch (error) {
      console.error('Update admin user error:', error);
      res.status(500).json({ error: 'Failed to update admin user' });
    }
  });

  app.delete('/api/admin/users/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteAdminUser(parseInt(id));

      if (!success) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ success: true, message: 'Admin user deleted successfully' });
    } catch (error) {
      console.error('Delete admin user error:', error);
      res.status(500).json({ error: 'Failed to delete admin user' });
    }
  });

  // Admin login endpoint
  app.post('/api/admin/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      console.log('Login attempt for username:', username);

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      // First check if admin table exists and has data
      const allAdmins = await storage.getAllAdminUsers();
      console.log('Total admin users in database:', allAdmins.length);

      const admin = await storage.getAdminByUsername(username);

      if (!admin) {
        console.log('Admin user not found:', username);
        console.log('Available admin usernames:', allAdmins.map(a => a.username));
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      console.log('Admin found:', { 
        id: admin.id, 
        username: admin.username, 
        email: admin.email,
        isActive: admin.isActive,
        role: admin.role,
        lastLogin: admin.lastLogin
      });

      if (!admin.isActive) {
        console.log('Admin account is not active');
        return res.status(401).json({ error: 'Invalid credentials or account disabled' });
      }

      console.log('Comparing passwords...');
      console.log('Provided password:', password);
      console.log('Stored hash:', admin.password);

      const isValidPassword = await bcrypt.compare(password, admin.password);
      console.log('Password comparison result:', isValidPassword);

      if (!isValidPassword) {
        console.log('Password mismatch for user:', username);
        console.log('Attempting direct comparison...');

        // Fallback: if bcrypt fails, try direct comparison for development
        if (password === 'admin123' && admin.username === 'admin') {
          console.log('Using fallback authentication');
          // Update the password with proper hash
          const hashedPassword = await bcrypt.hash('admin123', 12);
          await storage.updateAdminUser(admin.id, { password: hashedPassword });
        } else {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
      }

      // Update last login
      await storage.updateLastLogin(admin.id);

      console.log('Login successful for user:', username);

      const adminData = {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      };

      res.json({ 
        success: true, 
        admin: adminData,
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

  // Get single admin user endpoint
  app.get('/api/admin/users/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const users = await storage.getAllAdminUsers();
      const user = users.find(u => u.id === parseInt(id));

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Remove password from response
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error('Get admin user error:', error);
      res.status(500).json({ error: 'Failed to fetch admin user' });
    }
  });

  // Change admin password endpoint
  app.put('/api/admin/users/:id/change-password', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' });
      }

      // Get current user
      const users = await storage.getAllAdminUsers();      const user = users.find(u => u.id === parseInt(id));

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const updatedUser = await storage.updateAdminUser(parseInt(id), { 
        password: hashedPassword 
      });

      if (!updatedUser) {
        return res.status(500).json({ error: 'Failed to update password' });
      }

      res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Failed to change password' });
    }
  });

  // Seed admin account endpoint
  app.post('/api/seed-admin', async (req, res) => {
    try {
      console.log('Manual admin seeding requested...');

      // Check current admin users
      const allAdmins = await storage.getAllAdminUsers();
      console.log('Current admin users:', allAdmins.map(a => ({ id: a.id, username: a.username, email: a.email })));

      // Check if admin already exists
      const existingAdmin = await storage.getAdminByUsername('admin');

      if (existingAdmin) {
        console.log('Admin already exists, updating password...');
        const hashedPassword = await bcrypt.hash('admin123', 12);
        const updated = await storage.updateAdminUser(existingAdmin.id, { 
          password: hashedPassword,
          isActive: true
        });

        console.log('Admin password updated successfully:', updated?.username);

        return res.json({ 
          message: 'Admin account already exists - password updated',
          credentials: {
            username: 'admin',
            email: 'admin@chidiogara.dev',
            password: 'admin123'
          }
        });
      }

      console.log('Creating new admin user...');
      const adminUser = await storage.createAdminUser({
        username: 'admin',
        email: 'admin@chidiogara.dev',
        password: 'admin123',
        role: 'admin'
      });

      console.log('Admin user created successfully:', adminUser.username);

      res.json({ 
        message: 'Admin account seeded successfully',
        credentials: {
          username: adminUser.username,
          email: adminUser.email,
          password: 'admin123'
        }
      });
    } catch (error: any) {
      console.error('Error seeding admin:', error);
      res.status(500).json({ error: 'Failed to seed admin account', details: error.message });
    }
  });

  // Client dashboard - get projects for a client
  app.get('/api/client/projects/:email', async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const clientProjects = await db
        .select()
        .from(projects)
        .where(eq(projects.clientEmail, email))
        .orderBy(desc(projects.createdAt));

      res.json(clientProjects);
    } catch (error) {
      console.error('Get client projects error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get project updates for a specific project
  app.get('/api/projects/:id/updates', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = await db
        .select()
        .from(projectUpdates)
        .where(and(
          eq(projectUpdates.projectId, parseInt(id)),
          eq(projectUpdates.isVisibleToClient, true)
        ))
        .orderBy(desc(projectUpdates.createdAt));

      res.json(updates);
    } catch (error) {
      console.error('Get project updates error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Admin - add project update
  app.post('/api/admin/projects/:id/updates', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, description, updateType, isVisibleToClient = true } = req.body;

      const [update] = await db
        .insert(projectUpdates)
        .values({
          projectId: parseInt(id),
          updatedBy: 1,
          updateType,
          title,
          description,
          isVisibleToClient
        })
        .returning();

      res.json(update);
    } catch (error) {
      console.error('Add project update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Admin - update project status and progress
  app.patch('/api/admin/projects/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, progress, notes } = req.body;

      const [updatedProject] = await db
        .update(projects)
        .set({ 
          status, 
          progress: parseInt(progress || 0),
          notes
        })
        .where(eq(projects.id, parseInt(id)))
        .returning();

      if (status || progress) {
        await db
          .insert(projectUpdates)
          .values({
            projectId: parseInt(id),
            updatedBy: 1,
            updateType: 'status_change',
            title: `Project ${status ? 'status' : 'progress'} updated`,
            description: status ? `Status changed to ${status}` : `Progress updated to ${progress}%`,
            newValue: status || progress.toString(),
            isVisibleToClient: true
          });
      }

      res.json(updatedProject);
    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get messages for a project
  app.get('/api/projects/:id/messages', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const projectMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.projectId, parseInt(id)))
        .orderBy(desc(messages.createdAt));

      res.json(projectMessages);
    } catch (error) {
      console.error('Get project messages error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Send message
  app.post('/api/projects/:id/messages', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { senderId, senderType, recipientId, recipientType, subject, message } = req.body;

      const [newMessage] = await db
        .insert(messages)
        .values({
          projectId: parseInt(id),
          senderId,
          senderType,
          recipientId,
          recipientType,
          subject,
          message
        })
        .returning();

      res.json(newMessage);
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get all bookings with projects (admin view)
  app.get('/api/admin/bookings-with-projects', async (req: Request, res: Response) => {
    try {
      const bookingsWithProjects = await db
        .select({
          bookingId: bookings.id,
          bookingName: bookings.name,
          bookingEmail: bookings.email,
          bookingService: bookings.service,
          bookingStatus: bookings.paymentStatus,
          bookingCreatedAt: bookings.createdAt,
          projectId: projects.id,
          projectName: projects.name,
          projectStatus: projects.status,
          projectProgress: projects.progress,
          projectDueDate: projects.dueDate
        })
        .from(bookings)
        .leftJoin(projects, eq(bookings.id, projects.bookingId))
        .orderBy(desc(bookings.createdAt));

      res.json(bookingsWithProjects);
    } catch (error) {
      console.error('Get bookings with projects error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Paystack webhook endpoint
  app.post('/api/paystack/webhook', async (req: Request, res: Response) => {
    const { handleWebhook } = await import('./api/paystack/webhook');
    return handleWebhook(req, res);
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
          callback_url: `https://chidi.onrender.com/payment/callback`
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
      console.error('Paystack initiation error:', error.response ? error.response.data : error.message);
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

      // Step 3: Update booking payment status
      const bookingId = paystackTransactionDetails.metadata?.booking_id;
      if (bookingId) {
        await storage.updateBooking(parseInt(bookingId), { 
          paymentStatus: 'completed' 
        });

        // Create or update project
        const existingProject = await storage.getProjectByBookingId(parseInt(bookingId));
        const booking = await storage.getBookingById(parseInt(bookingId));

        if (!existingProject && booking) {
          await storage.createProject({
            bookingId: parseInt(bookingId),
            name: `${booking.service} - ${booking.projectType}`,
            description: booking.message || `${booking.service} project for ${booking.name}`,
            status: 'planning',
            priority: 'medium',
            clientEmail: booking.email,
            budget: paystackTransactionDetails.amount / 100,
            estimatedTime: 40, // Default estimate
            notes: `Project created from booking #${bookingId}`
          });
        }

        // Log payment
        await storage.createPaymentLog({
          bookingId: parseInt(bookingId),
          projectId: existingProject?.id || null,
          amount: paystackTransactionDetails.amount / 100,
          status: 'completed',
          reference: paystackTransactionDetails.reference,
          customerEmail: paystackTransactionDetails.customer?.email || '',
          serviceName: paystackTransactionDetails.metadata?.service_name || clientService || 'Unknown Service',
          projectDetails: {
            booking: booking,
            paystack_data: paystackTransactionDetails
          },
          paidAt: new Date()
        });
      }

      // Step 4: Return success response
      res.json({
        success: true,
        message: 'Payment verified and processed successfully.',
        data: {
          reference: paystackTransactionDetails.reference,
          amount: paystackTransactionDetails.amount / 100,
          service: paystackTransactionDetails.metadata?.service_name || clientService || 'Unknown Service',
          customerEmail: paystackTransactionDetails.customer?.email,
          bookingId: bookingId
        }
      });

    } catch (error: any) {
      console.error('Payment verification process error:', error.response ? error.response.data : error.message);

      if (error.response) {
        return res.status(error.response.status || 400).json({
          success: false,
          message: error.response.data?.message || 'Error verifying payment with Paystack.'
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'An unexpected error occurred during payment verification.'
      });
    }
  });

  // Admin profile endpoint
    app.get('/api/admin/users/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const user = await storage.getAdminUserById(parseInt(id));

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
      } catch (error) {
        console.error('Failed to get admin user:', error);
        res.status(500).json({ error: 'Failed to get user' });
      }
    });

    // Get all admin users (team members)
    app.get('/api/admin/users', async (req, res) => {
      try {
        const users = await storage.getAllAdminUsers();
        res.json(users);
      } catch (error) {
        console.error('Failed to get admin users:', error);
        res.status(500).json({ error: 'Failed to get users' });
      }
    });

    // Create new admin user (team member)
    app.post('/api/admin/users', async (req, res) => {
      try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await storage.createAdminUser({
          username,
          email,
          password: hashedPassword,
          role: role || 'team_member'
        });

        res.status(201).json({ success: true, user });
      } catch (error) {
        console.error('Failed to create admin user:', error);
        res.status(500).json({ error: 'Failed to create user' });
      }
    });

    // Delete admin user
    app.delete('/api/admin/users/:id', async (req, res) => {
      try {
        const { id } = req.params;
        await storage.deleteAdminUser(parseInt(id));
        res.json({ success: true, message: 'User deleted successfully' });
      } catch (error) {
        console.error('Failed to delete admin user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
      }
    });

    // Projects endpoints
    app.get('/api/projects', async (req, res) => {
      try {
        const projects = await storage.getAllProjects();
        res.json(projects);
      } catch (error) {
        console.error('Failed to get projects:', error);
        res.status(500).json({ error: 'Failed to get projects' });
      }
    });

    app.post('/api/projects', async (req, res) => {
      try {
        const projectData = req.body;
        const project = await storage.createProject(projectData);
        res.status(201).json({ success: true, project });
      } catch (error) {
        console.error('Failed to create project:', error);
        res.status(500).json({ error: 'Failed to create project' });
      }
    });

    app.put('/api/projects/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const updateData = req.body;
        const project = await storage.updateProject(parseInt(id), updateData);
        res.json({ success: true, project });
      } catch (error) {
        console.error('Failed to update project:', error);
        res.status(500).json({ error: 'Failed to update project' });
      }
    });

    app.delete('/api/projects/:id', async (req, res) => {
      try {
        const { id } = req.params;
        await storage.deleteProject(parseInt(id));
        res.json({ success: true, message: 'Project deleted successfully' });
      } catch (error) {
        console.error('Failed to delete project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
      }
    });

    // Client projects endpoint
    app.get('/api/client/projects/:email', async (req, res) => {
      try {
        const { email } = req.params;
        const projects = await storage.getProjectsByClientEmail(decodeURIComponent(email));
        res.json(projects);
      } catch (error) {
        console.error('Failed to get client projects:', error);
        res.status(500).json({ error: 'Failed to get projects' });
      }
    });

    // Project updates endpoints
    app.get('/api/projects/:id/updates', async (req, res) => {
      try {
        const { id } = req.params;
        const updates = await storage.getProjectUpdates(parseInt(id));
        res.json(updates);
      } catch (error) {
        console.error('Failed to get project updates:', error);
        res.status(500).json({ error: 'Failed to get updates' });
      }
    });

    // Project messages endpoints
    app.get('/api/projects/:id/messages', async (req, res) => {
      try {
        const { id } = req.params;
        const messages = await storage.getProjectMessages(parseInt(id));
        res.json(messages);
      } catch (error) {
        console.error('Failed to get project messages:', error);
        res.status(500).json({ error: 'Failed to get messages' });
      }
    });

    app.post('/api/projects/:id/messages', async (req, res) => {
      try {
        const { id } = req.params;
        const messageData = {
          ...req.body,
          projectId: parseInt(id)
        };
        const message = await storage.createMessage(messageData);
        res.status(201).json({ success: true, message });
      } catch (error) {
        console.error('Failed to create message:', error);
        res.status(500).json({ error: 'Failed to create message' });
      }
    });

    // Payment logs endpoint
    app.get('/api/payment-logs', async (req, res) => {
      try {
        const logs = await storage.getAllPaymentLogs();
        res.json(logs);
      } catch (error) {
        console.error('Failed to get payment logs:', error);
        res.status(500).json({ error: 'Failed to get payment logs' });
      }
    });

  const httpServer = createServer(app);
  return httpServer;
}