import { User, Customer, IUser, ICustomer, InsertCustomer, UpsertUser } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<IUser | null>;
  upsertUser(user: UpsertUser & { _id?: string }): Promise<IUser>;

  // Customer operations
  getCustomersByUserId(userId: string): Promise<ICustomer[]>;
  getCustomerById(id: string, userId: string): Promise<ICustomer | null>;
  createCustomer(customer: InsertCustomer & { userId: string }): Promise<ICustomer>;
  updateCustomer(id: string, userId: string, customer: Partial<InsertCustomer>): Promise<ICustomer | null>;
  deleteCustomer(id: string, userId: string): Promise<boolean>;
  isEmailUniqueForUser(email: string, userId: string, excludeId?: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async upsertUser(userData: UpsertUser & { _id?: string }): Promise<IUser> {
    if (userData._id) {
      const user = await User.findByIdAndUpdate(
        userData._id,
        { ...userData, updatedAt: new Date() },
        { new: true, upsert: true }
      );
      return user!;
    } else {
      const user = new User(userData);
      await user.save();
      return user;
    }
  }

  // Customer operations
  async getCustomersByUserId(userId: string): Promise<ICustomer[]> {
    return await Customer.find({ userId }).sort({ createdAt: -1 });
  }

  async getCustomerById(id: string, userId: string): Promise<ICustomer | null> {
    return await Customer.findOne({ _id: id, userId });
  }

  async createCustomer(customerData: InsertCustomer & { userId: string }): Promise<ICustomer> {
    const customer = new Customer(customerData);
    await customer.save();
    return customer;
  }

  async updateCustomer(id: string, userId: string, customerData: Partial<InsertCustomer>): Promise<ICustomer | null> {
    return await Customer.findOneAndUpdate(
      { _id: id, userId },
      { ...customerData, updatedAt: new Date() },
      { new: true }
    );
  }

  async deleteCustomer(id: string, userId: string): Promise<boolean> {
    const result = await Customer.deleteOne({ _id: id, userId });
    return result.deletedCount === 1;
  }

  async isEmailUniqueForUser(email: string, userId: string, excludeId?: string): Promise<boolean> {
    const query: any = { email, userId };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await Customer.findOne(query);
    return !existing;
  }
}

export const storage = new DatabaseStorage();