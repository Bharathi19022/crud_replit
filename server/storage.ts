import {
  users,
  customers,
  type User,
  type UpsertUser,
  type Customer,
  type InsertCustomer,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Customer operations
  getCustomersByUserId(userId: string): Promise<Customer[]>;
  getCustomerById(id: string, userId: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer & { userId: string }): Promise<Customer>;
  updateCustomer(id: string, userId: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: string, userId: string): Promise<boolean>;
  isEmailUniqueForUser(email: string, userId: string, excludeId?: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Customer operations
  async getCustomersByUserId(userId: string): Promise<Customer[]> {
    return await db
      .select()
      .from(customers)
      .where(eq(customers.userId, userId))
      .orderBy(desc(customers.createdAt));
  }

  async getCustomerById(id: string, userId: string): Promise<Customer | undefined> {
    const [customer] = await db
      .select()
      .from(customers)
      .where(and(eq(customers.id, id), eq(customers.userId, userId)));
    return customer;
  }

  async createCustomer(customerData: InsertCustomer & { userId: string }): Promise<Customer> {
    const [customer] = await db
      .insert(customers)
      .values({
        ...customerData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return customer;
  }

  async updateCustomer(id: string, userId: string, customerData: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const [customer] = await db
      .update(customers)
      .set({
        ...customerData,
        updatedAt: new Date(),
      })
      .where(and(eq(customers.id, id), eq(customers.userId, userId)))
      .returning();
    return customer;
  }

  async deleteCustomer(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(customers)
      .where(and(eq(customers.id, id), eq(customers.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async isEmailUniqueForUser(email: string, userId: string, excludeId?: string): Promise<boolean> {
    const query = excludeId 
      ? and(
          eq(customers.email, email), 
          eq(customers.userId, userId),
          eq(customers.id, excludeId) // This will NOT match (we want different IDs)
        )
      : and(eq(customers.email, email), eq(customers.userId, userId));
    
    const existing = await db
      .select()
      .from(customers)
      .where(and(eq(customers.email, email), eq(customers.userId, userId)));
    
    // If we're excluding an ID (update case), check if any matching email belongs to a different customer
    if (excludeId) {
      return existing.length === 0 || (existing.length === 1 && existing[0].id === excludeId);
    }
    
    return existing.length === 0;
  }
}

export const storage = new DatabaseStorage();
