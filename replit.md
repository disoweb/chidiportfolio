# Portfolio Website Architecture

## Overview

This is a modern full-stack portfolio website for Chidi Ogara, a Senior Fullstack Developer. The application is built as a monorepo with a React frontend, Express.js backend, and PostgreSQL database. It showcases professional experience, skills, and projects while providing interactive features like AI chatbot, contact forms, booking system, and admin dashboard.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Animations**: Framer Motion for smooth interactions
- **Theme**: Custom design system with light/dark mode support

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless adapter
- **Authentication**: Session-based auth with bcrypt for password hashing
- **API Structure**: RESTful endpoints with proper error handling

### Database Schema
- **Users**: Client authentication and profile management
- **Admin Users**: Administrative access control
- **Contacts**: Contact form submissions
- **Bookings**: Service booking requests with payment integration
- **Projects & Updates**: Portfolio project management
- **Messages & Notifications**: Communication system
- **Transactions & Orders**: Payment processing records

## Key Components

### Portfolio Features
- **Hero Section**: Professional introduction with call-to-action buttons
- **About Section**: Personal background and expertise overview
- **Skills Section**: Technical skills categorized by domain (frontend, backend, engineering)
- **Projects Section**: Featured projects with case studies and metrics
- **Services Section**: Available services with pricing and booking integration
- **Contact Form**: Direct communication with validation and submission handling

### Interactive Features
- **AI Chatbot**: Context-aware assistant for visitor inquiries
- **Booking System**: Service booking with form validation and email collection
- **Payment Integration**: Paystack payment gateway for service purchases
- **Client Dashboard**: User portal for managing bookings and projects
- **Admin Dashboard**: Complete administrative interface for content management

### Admin System
- **Authentication**: Secure admin login with token-based sessions
- **Content Management**: Projects, bookings, contacts, and user management
- **Analytics Dashboard**: Performance metrics and visitor insights
- **Settings Management**: Site-wide configuration and SEO settings

## Data Flow

### User Journey
1. **Landing Page**: Visitors explore portfolio sections with smooth scrolling navigation
2. **Service Selection**: Users browse services and initiate booking process
3. **Booking Flow**: Form submission → Email collection → Payment processing → Confirmation
4. **Client Portal**: Registered users access dashboard for project tracking
5. **Admin Management**: Administrators manage all content and user interactions

### API Communication
- **Frontend ↔ Backend**: RESTful API calls with proper error handling
- **Database Operations**: Drizzle ORM with connection pooling for efficient queries
- **Payment Processing**: Secure Paystack integration with webhook verification
- **Real-time Updates**: Query invalidation for immediate UI updates

## External Dependencies

### Payment Processing
- **Paystack**: Primary payment gateway for service transactions
- **Webhook Handling**: Secure payment verification and status updates

### AI Integration
- **Google Generative AI**: Powers the intelligent chatbot functionality
- **Context-Aware Responses**: Personalized assistance based on portfolio content

### Infrastructure
- **Neon Database**: Serverless PostgreSQL with automatic scaling
- **Email Services**: Integrated for booking confirmations and notifications
- **Asset Optimization**: Image optimization and lazy loading for performance

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR for frontend
- **Database**: Local PostgreSQL or Neon development instance
- **Environment Variables**: Secure credential management for API keys

### Production Deployment
- **Build Process**: Vite builds optimized frontend bundle
- **Server Bundle**: ESBuild creates Node.js production bundle
- **Database Migrations**: Automated schema updates with Drizzle
- **Health Checks**: API endpoints for monitoring system status

### Performance Optimizations
- **Code Splitting**: Lazy loading for optimal bundle sizes
- **Database Indexing**: Optimized queries with proper indexing
- **Caching Strategy**: Query caching and static asset optimization
- **SEO Enhancement**: Meta tags, structured data, and semantic HTML

## Changelog

Changelog:
- July 02, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.