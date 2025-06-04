import { users, contacts, bookings, type User, type InsertUser, type Contact, type InsertContact, type Booking, type InsertBooking } from "@shared/schema";
import { db } from "./db";
import { contacts, bookings, type Contact, type Booking, type InsertContact, type InsertBooking } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  getAllBookings(): Promise<Booking[]>;
  updateBooking(id: number, data: Partial<Booking>): Promise<Booking | null>;
  deleteBooking(id: number): Promise<boolean>;
  getBookingById(id: number): Promise<Booking | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

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
      .orderBy(contacts.createdAt);
    return contactList.reverse(); // Most recent first
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values(insertBooking)
      .returning();
    return booking;
  }

  async getAllBookings(): Promise<Booking[]> {
    const bookingList = await db
      .select()
      .from(bookings)
      .orderBy(bookings.createdAt);
    return bookingList.reverse(); // Most recent first
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

  async getBookingById(id: number): Promise<Booking | undefined> {
    try {
      const [booking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, id));
      
      return booking || undefined;
    } catch (error) {
      console.error('Get booking by ID error:', error);
      return undefined;
    }
  }
}

export const storage = new DatabaseStorage();