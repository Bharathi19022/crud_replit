import mongoose, { Schema, Document } from 'mongoose';
import { z } from "zod";

// Customer status enum
export const customerStatusEnum = ['Lead', 'Active', 'Inactive'] as const;

// User interface and model
export interface IUser extends Document {
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, unique: true, sparse: true },
  firstName: String,
  lastName: String,
  profileImageUrl: String,
}, {
  timestamps: true,
});

export const User = mongoose.model<IUser>('User', userSchema);

// Customer interface and model
export interface ICustomer extends Document {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: typeof customerStatusEnum[number];
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>({
  userId: { type: String, required: true, ref: 'User', index: true },
  name: { type: String, required: true, maxlength: 255 },
  email: { type: String, required: true, maxlength: 255 },
  phone: { type: String, maxlength: 50 },
  company: { type: String, maxlength: 255 },
  status: {
    type: String,
    enum: customerStatusEnum,
    default: 'Lead',
    required: true
  },
}, {
  timestamps: true,
});

// Unique constraint on email per user
customerSchema.index({ email: 1, userId: 1 }, { unique: true });

export const Customer = mongoose.model<ICustomer>('Customer', customerSchema);

// Zod schemas for validation
export const insertCustomerSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().max(50).optional().nullable(),
  company: z.string().max(255).optional().nullable(),
  status: z.enum(['Lead', 'Active', 'Inactive']),
});

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type UpsertUser = Partial<IUser>;