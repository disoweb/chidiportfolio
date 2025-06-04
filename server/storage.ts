import { db } from "./db";
import { 
  contacts, bookings, transactions, orders, adminUsers, siteSettings, inquiries,
  type Contact, type InsertContact,
  type Booking, type InsertBooking,
  type Transaction, type InsertTransaction,
  type Order, type InsertOrder,
  type AdminUser, type InsertAdminUser,
  type SiteSetting, type InsertSiteSetting,
  type Inquiry, type InsertInquiry
} from "@shared/schema";
import { eq, desc, and, like, or } from "drizzle-orm";
import bcrypt from 'bcryptjs';

class DatabaseStorage {
  // Contact methods
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    const contactList = await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt));
    return contactList;
  }

  async getContactById(id: number): Promise<Contact | undefined> {
    const [contact] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id));
    return contact;
  }

  async deleteContact(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(contacts)
        .where(eq(contacts.id, id))
        .returning();
      return result.length > 0;
    } catch (error) {
      console.error('Delete contact error:', error);
      return false;
    }
  }

  // Booking methods
  async createBooking(data: InsertBooking): Promise<Booking> {
    try {
      console.log('Creating booking with data:', data);
      const [booking] = await db.insert(bookings).values(data).returning();
      console.log('Booking created successfully:', booking);
      return booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getAllBookings(): Promise<Booking[]> {
    const bookingList = await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt));
    return bookingList;
  }

  async getBookingById(id: number): Promise<Booking | undefined> {
    try {
      const [booking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, id));
      return booking;
    } catch (error) {
      console.error('Get booking by ID error:', error);
      return undefined;
    }
  }

  async updateBooking(id: number, data: Partial<Booking>): Promise<Booking | null> {
    try {
      const [updatedBooking] = await db
        .update(bookings)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(bookings.id, id))
        .returning();

      return updatedBooking || null;
    } catch (error) {
      console.error('Update booking error:', error);
      return null;
    }
  }

  async deleteBooking(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(bookings)
        .where(eq(bookings.id, id))
        .returning();

      return result.length > 0;
    } catch (error) {
      console.error('Delete booking error:', error);
      return false;
    }
  }

  async searchBookings(searchTerm: string, paymentStatus?: string): Promise<Booking[]> {
    try {
      let query = db.select().from(bookings);

      const conditions = [];

      if (searchTerm) {
        conditions.push(
          or(
            like(bookings.name, `%${searchTerm}%`),
            like(bookings.email, `%${searchTerm}%`),
            like(bookings.service, `%${searchTerm}%`),
            like(bookings.projectType, `%${searchTerm}%`)
          )
        );
      }

      if (paymentStatus && paymentStatus !== 'all') {
        conditions.push(eq(bookings.paymentStatus, paymentStatus));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const result = await query.orderBy(desc(bookings.createdAt));
      return result;
    } catch (error) {
      console.error('Search bookings error:', error);
      return [];
    }
  }

  // Admin user methods
  async createAdminUser(insertAdminUser: InsertAdminUser): Promise<AdminUser> {
    const hashedPassword = await bcrypt.hash(insertAdminUser.password, 10);
    const [adminUser] = await db
      .insert(adminUsers)
      .values({
        ...insertAdminUser,
        password: hashedPassword
      })
      .returning();
    return adminUser;
  }

  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username));
    return admin;
  }

  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email));
    return admin;
  }

  async getAllAdminUsers(): Promise<AdminUser[]> {
    const adminList = await db
      .select()
      .from(adminUsers)
      .orderBy(desc(adminUsers.createdAt));
    return adminList;
  }

  async updateAdminUser(id: number, data: Partial<AdminUser>): Promise<AdminUser | null> {
    try {
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }

      const [updatedAdmin] = await db
        .update(adminUsers)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(adminUsers.id, id))
        .returning();

      return updatedAdmin || null;
    } catch (error) {
      console.error('Update admin user error:', error);
      return null;
    }
  }

  async deleteAdminUser(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(adminUsers)
        .where(eq(adminUsers.id, id))
        .returning();

      return result.length > 0;
    } catch (error) {
      console.error('Delete admin user error:', error);
      return false;
    }
  }

  async updateLastLogin(id: number): Promise<void> {
    try {
      await db
        .update(adminUsers)
        .set({ lastLogin: new Date() })
        .where(eq(adminUsers.id, id));
    } catch (error) {
      console.error('Update last login error:', error);
    }
  }

  async getAllSiteSettings() {
    try {
      return await db.select().from(siteSettings).orderBy(siteSettings.category, siteSettings.key);
    } catch (error) {
      if (error.code === '42P01') {
        console.log('Database tables do not exist yet, returning empty settings');
        return [];
      }
      throw error;
    }
  }

  async getSiteSettingByKey(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key));
    return setting;
  }

  async updateSiteSetting(key: string, value: string): Promise<SiteSetting | null> {
    try {
      const [updatedSetting] = await db
        .update(siteSettings)
        .set({ 
          value,
          updatedAt: new Date()
        })
        .where(eq(siteSettings.key, key))
        .returning();

      return updatedSetting || null;
    } catch (error) {
      console.error('Update site setting error:', error);
      return null;
    }
  }

  async upsertSiteSetting(key: string, value: string, category: string = 'general', description?: string): Promise<SiteSetting> {
    try {
      const existing = await this.getSiteSettingByKey(key);

      if (existing) {
        const updated = await this.updateSiteSetting(key, value);
        return updated!;
      } else {
        return await this.createSiteSetting({
          key,
          value,
          category,
          description
        });
      }
    } catch (error) {
      console.error('Upsert site setting error:', error);
      throw error;
    }
  }

  async createSiteSetting(insertSiteSetting: InsertSiteSetting): Promise<SiteSetting> {
    const [setting] = await db
      .insert(siteSettings)
      .values(insertSiteSetting)
      .returning();
    return setting;
  }

  async deleteSiteSetting(key: string): Promise<boolean> {
    try {
      const result = await db
        .delete(siteSettings)
        .where(eq(siteSettings.key, key))
        .returning();

      return result.length > 0;
    } catch (error) {
      console.error('Delete site setting error:', error);
      return false;
    }
  }

  // Inquiry methods
  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await db
      .insert(inquiries)
      .values(insertInquiry)
      .returning();
    return inquiry;
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    const inquiriesList = await db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt));
    return inquiriesList;
  }

  async getInquiryById(id: number): Promise<Inquiry | undefined> {
    const [inquiry] = await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.id, id));
    return inquiry;
  }

  async updateInquiry(id: number, data: Partial<Inquiry>): Promise<Inquiry | null> {
    try {
      const [updatedInquiry] = await db
        .update(inquiries)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(inquiries.id, id))
        .returning();

      return updatedInquiry || null;
    } catch (error) {
      console.error('Update inquiry error:', error);
      return null;
    }
  }

  async deleteInquiry(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(inquiries)
        .where(eq(inquiries.id, id))
        .returning();

      return result.length > 0;
    } catch (error) {
      console.error('Delete inquiry error:', error);
      return false;
    }
  }

  async searchInquiries(searchTerm: string, status?: string): Promise<Inquiry[]> {
    try {
      let query = db.select().from(inquiries);

      const conditions = [];

      if (searchTerm) {
        conditions.push(
          or(
            like(inquiries.name, `%${searchTerm}%`),
            like(inquiries.email, `%${searchTerm}%`),
            like(inquiries.service, `%${searchTerm}%`)
          )
        );
      }

      if (status && status !== 'all') {
        conditions.push(eq(inquiries.status, status));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const result = await query.orderBy(desc(inquiries.createdAt));
      return result;
    } catch (error) {
      console.error('Search inquiries error:', error);
      return [];
    }
  }

  // Transaction methods
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const transactionsList = await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.createdAt));
    return transactionsList;
  }

  async getTransactionByReference(reference: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.reference, reference));
    return transaction;
  }

  async updateTransaction(id: number, data: Partial<Transaction>): Promise<Transaction | null> {
    try {
      const [updatedTransaction] = await db
        .update(transactions)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(transactions.id, id))
        .returning();

      return updatedTransaction || null;
    } catch (error) {
      console.error('Update transaction error:', error);
      return null;
    }
  }

  // Order methods
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    const ordersList = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));
    return ordersList;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id));
    return order;
  }

  async updateOrder(id: number, data: Partial<Order>): Promise<Order | null> {
    try {
      const [updatedOrder] = await db
        .update(orders)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(orders.id, id))
        .returning();

      return updatedOrder || null;
    } catch (error) {
      console.error('Update order error:', error);
      return null;
    }
  }

  // Initialize default settings
  async initializeDefaultSettings() {
    try {
      // Check if tables exist by trying to query one
      await this.getAllSiteSettings();
      console.log('Database tables exist, initializing default settings...');

      const defaultSettings = [
        { key: 'seo_title', value: 'Chidi Ogara - Senior Fullstack Developer', category: 'seo', description: 'Main site title for SEO' },
        { key: 'seo_description', value: 'Professional fullstack web developer specializing in React, Node.js, and modern web technologies. Building scalable solutions for businesses.', category: 'seo', description: 'Meta description for SEO' },
        { key: 'seo_keywords', value: 'fullstack developer, web development, React, Node.js, TypeScript, JavaScript, web applications', category: 'seo', description: 'Keywords for SEO' },
        { key: 'og_image', value: '/og-image.jpg', category: 'seo', description: 'Open Graph image URL' },
        { key: 'site_name', value: 'Chidi Ogara Portfolio', category: 'general', description: 'Site name' },
        { key: 'contact_email', value: 'chidi@example.com', category: 'contact', description: 'Main contact email' },
        { key: 'linkedin_url', value: 'https://linkedin.com/in/chidiogara', category: 'social', description: 'LinkedIn profile URL' },
        { key: 'github_url', value: 'https://github.com/chidiogara', category: 'social', description: 'GitHub profile URL' },
        { key: 'twitter_url', value: 'https://twitter.com/chidiogara', category: 'social', description: 'Twitter profile URL' },
      ];

      for (const setting of defaultSettings) {
        try {
          await this.upsertSiteSetting(setting.key, setting.value, setting.category, setting.description);
        } catch (error) {
          console.error(`Failed to initialize setting ${setting.key}:`, error);
        }
      }

      console.log('Default settings initialized successfully');
    } catch (error) {
      if (error.code === '42P01') {
        console.log('Database tables do not exist yet, skipping settings initialization');
      } else {
        console.error('Error initializing default settings:', error);
      }
    }
  }
}

export const storage = new DatabaseStorage();