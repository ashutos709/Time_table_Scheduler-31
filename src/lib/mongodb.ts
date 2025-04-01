
import mongoose from 'mongoose';
import { toast } from 'sonner';

// MongoDB connection URI (should be replaced with your actual MongoDB URI)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/scheduler';

// Create a MongoDB connection
const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    toast.error('Failed to connect to database');
    throw error;
  }
};

export default connectMongoDB;
