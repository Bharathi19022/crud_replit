import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertCustomerSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);

  // Auth routes - Get current user
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Customer Routes

  // GET /api/customers - List all customers for the logged-in user
  app.get("/api/customers", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const customers = await storage.getCustomersByUserId(userId);
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  // GET /api/customers/:id - Get a single customer
  app.get("/api/customers/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      const customer = await storage.getCustomerById(id, userId);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      
      res.json(customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  // POST /api/customers - Create a new customer
  app.post("/api/customers", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate request body
      const validationResult = insertCustomerSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationResult.error.errors 
        });
      }

      const { name, email, phone, company, status } = validationResult.data;

      // Check if email is unique for this user
      const isUnique = await storage.isEmailUniqueForUser(email, userId);
      if (!isUnique) {
        return res.status(400).json({ 
          message: "A customer with this email already exists" 
        });
      }

      const customer = await storage.createCustomer({
        name,
        email,
        phone: phone || null,
        company: company || null,
        status,
        userId,
      });

      res.status(201).json(customer);
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(500).json({ message: "Failed to create customer" });
    }
  });

  // PUT /api/customers/:id - Update a customer
  app.put("/api/customers/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;

      // Check if customer exists and belongs to user
      const existingCustomer = await storage.getCustomerById(id, userId);
      if (!existingCustomer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      // Validate request body
      const validationResult = insertCustomerSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationResult.error.errors 
        });
      }

      const { name, email, phone, company, status } = validationResult.data;

      // Check if email is unique for this user (excluding current customer)
      const isUnique = await storage.isEmailUniqueForUser(email, userId, id);
      if (!isUnique) {
        return res.status(400).json({ 
          message: "A customer with this email already exists" 
        });
      }

      const customer = await storage.updateCustomer(id, userId, {
        name,
        email,
        phone: phone || null,
        company: company || null,
        status,
      });

      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      res.json(customer);
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ message: "Failed to update customer" });
    }
  });

  // DELETE /api/customers/:id - Delete a customer
  app.delete("/api/customers/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;

      const deleted = await storage.deleteCustomer(id, userId);
      if (!deleted) {
        return res.status(404).json({ message: "Customer not found" });
      }

      res.json({ message: "Customer deleted successfully" });
    } catch (error) {
      console.error("Error deleting customer:", error);
      res.status(500).json({ message: "Failed to delete customer" });
    }
  });

  return httpServer;
}
