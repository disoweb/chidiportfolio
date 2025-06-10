import { pgTable, text, serial, timestamp, varchar, numeric, json, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table - Client users who book services
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  isActive: boolean("is_active").default(true),
  emailVerified: boolean("email_verified").default(false),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Contacts Table
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Bookings Table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  service: text("service").notNull(),
  projectType: text("project_type"),
  budget: varchar("budget", { length: 50 }),
  timeline: text("timeline"),
  message: text("message"),
  paymentStatus: varchar("payment_status", { length: 20 }).default('pending'),
  transactionId: integer("transaction_id").references(() => transactions.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Transactions Table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 100 }).notNull().unique(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default('NGN'),
  status: varchar("status", { length: 20 }).notNull(),
  serviceId: varchar("service_id", { length: 50 }),
  serviceName: varchar("service_name", { length: 100 }).notNull(),
  customerEmail: varchar("customer_email", { length: 100 }).notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Orders Table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  transactionId: integer("transaction_id").references(() => transactions.id),
  status: varchar("status", { length: 20 }).default('pending'),
  customerEmail: varchar("customer_email", { length: 100 }).notNull(),
  serviceId: varchar("service_id", { length: 50 }),
  serviceName: varchar("service_name", { length: 100 }).notNull(),
  bookingId: integer("booking_id").references(() => bookings.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Admin Users Table
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 20 }).default('admin'),
  isActive: varchar("is_active", { length: 10 }).default('true'),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Site Settings Table
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  category: varchar("category", { length: 50 }).default('general'),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Inquiries Table
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  service: text("service").notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).default('new'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Projects Table for project management
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id),
  name: text("name").notNull(),
  description: text("description"),
  status: varchar("status", { length: 20 }).default('planning'), // planning, in-progress, testing, completed, on-hold
  priority: varchar("priority", { length: 10 }).default('medium'), // low, medium, high
  progress: integer("progress").default(0), // 0-100
  startDate: timestamp("start_date"),
  dueDate: timestamp("due_date"),
  completedDate: timestamp("completed_date"),
  assignedTo: text("assigned_to").default('Chidi Ogara'),
  clientEmail: text("client_email").notNull(),
  budget: numeric("budget", { precision: 10, scale: 2 }),
  timeSpent: integer("time_spent").default(0), // in hours
  estimatedTime: integer("estimated_time"), // in hours
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Payment Logs Table
export const paymentLogs = pgTable("payment_logs", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id),
  projectId: integer("project_id").references(() => projects.id),
  transactionId: integer("transaction_id").references(() => transactions.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default('NGN'),
  paymentMethod: varchar("payment_method", { length: 50 }).default('paystack'),
  status: varchar("status", { length: 20 }).notNull(),
  reference: varchar("reference", { length: 100 }).notNull(),
  customerEmail: varchar("customer_email", { length: 100 }).notNull(),
  serviceName: varchar("service_name", { length: 100 }).notNull(),
  projectDetails: json("project_details"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages Table - for communication between admin and clients
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  senderId: integer("sender_id"), // admin user id or client user id
  senderType: varchar("sender_type", { length: 10 }).notNull(), // 'admin' or 'client'
  recipientId: integer("recipient_id"),
  recipientType: varchar("recipient_type", { length: 10 }).notNull(), // 'admin' or 'client'
  subject: text("subject"),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  attachments: json("attachments"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications Table - for system notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  adminUserId: integer("admin_user_id").references(() => adminUsers.id),
  type: varchar("type", { length: 50 }).notNull(), // 'project_update', 'payment_received', 'message_received', etc.
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  data: json("data"), // additional data for the notification
  createdAt: timestamp("created_at").defaultNow(),
});

// Project Updates Table - for tracking project progress updates
export const projectUpdates = pgTable("project_updates", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  updatedBy: integer("updated_by").references(() => adminUsers.id).notNull(),
  updateType: varchar("update_type", { length: 50 }).notNull(), // 'status_change', 'progress_update', 'milestone', 'note'
  title: text("title").notNull(),
  description: text("description"),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  attachments: json("attachments"),
  isVisibleToClient: boolean("is_visible_to_client").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Team Members Table - for managing team roles and permissions
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  adminUserId: integer("admin_user_id").references(() => adminUsers.id).notNull(),
  role: varchar("role", { length: 50 }).default('team_member'), // 'owner', 'admin', 'project_manager', 'team_member'
  permissions: json("permissions"), // array of permission strings
  departmentId: integer("department_id").references(() => departments.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Departments Table - for organizing team members
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  managerId: integer("manager_id").references(() => adminUsers.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Client Sessions Table - for managing client login sessions
export const clientSessions = pgTable("client_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  phone: true,
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  firstName: true,
  lastName: true,
  email: true,
  subject: true,
  message: true,
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  name: true,
  email: true,
  phone: true,
  service: true,
  projectType: true,
  budget: true,
  timeline: true,
  message: true,
}).partial({
  phone: true,
  projectType: true,
  budget: true,
  timeline: true,
  message: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  amount: true,
  serviceName: true,
  customerEmail: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  transactionId: true,
  customerEmail: true,
  serviceName: true,
  bookingId: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).pick({
  username: true,
  email: true,
  password: true,
  role: true,
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).pick({
  key: true,
  value: true,
  category: true,
  description: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).pick({
  name: true,
  email: true,
  phone: true,
  service: true,
  message: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  bookingId: true,
  name: true,
  description: true,
  status: true,
  priority: true,
  startDate: true,
  dueDate: true,
  clientEmail: true,
  budget: true,
  estimatedTime: true,
  notes: true,
});

export const insertPaymentLogSchema = createInsertSchema(paymentLogs).pick({
  bookingId: true,
  projectId: true,
  transactionId: true,
  amount: true,
  status: true,
  reference: true,
  customerEmail: true,
  serviceName: true,
  projectDetails: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  projectId: true,
  senderId: true,
  senderType: true,
  recipientId: true,
  recipientType: true,
  subject: true,
  message: true,
  attachments: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  adminUserId: true,
  type: true,
  title: true,
  message: true,
  data: true,
});

export const insertProjectUpdateSchema = createInsertSchema(projectUpdates).pick({
  projectId: true,
  updatedBy: true,
  updateType: true,
  title: true,
  description: true,
  oldValue: true,
  newValue: true,
  attachments: true,
  isVisibleToClient: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).pick({
  adminUserId: true,
  role: true,
  permissions: true,
  departmentId: true,
});

export const insertDepartmentSchema = createInsertSchema(departments).pick({
  name: true,
  description: true,
  managerId: true,
});

export const insertClientSessionSchema = createInsertSchema(clientSessions).pick({
  userId: true,
  sessionToken: true,
  expiresAt: true,
  ipAddress: true,
  userAgent: true,
});

// Type Definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type PaymentLog = typeof paymentLogs.$inferSelect;
export type InsertPaymentLog = z.infer<typeof insertPaymentLogSchema>;

// New table type definitions
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type ProjectUpdate = typeof projectUpdates.$inferSelect;
export type InsertProjectUpdate = z.infer<typeof insertProjectUpdateSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type ClientSession = typeof clientSessions.$inferSelect;
export type InsertClientSession = z.infer<typeof insertClientSessionSchema>;

// Additional Utility Types
export type BookingWithTransaction = Booking & {
  transaction: Transaction | null;
};

export type TransactionWithOrder = Transaction & {
  order: Order | null;
  booking: Booking | null;
};