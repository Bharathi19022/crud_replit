
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI must be set. Did you forget to add your MongoDB connection string?",
      );
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('\nPlease ensure:');
    console.error('1. Your IP is whitelisted in MongoDB Atlas Network Access');
    console.error('2. Your connection string includes the database name');
    console.error('3. Your MongoDB credentials are correct');
    process.exit(1);
  }
};

export { mongoose };
