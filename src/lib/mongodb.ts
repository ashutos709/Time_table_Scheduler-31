
import mongoose from 'mongoose';
import { toast } from 'sonner';

// Using the provided MongoDB connection string
const MONGODB_URI = 'mongodb+srv://avadhutchendage015:avadhut@cluster0.78x0q6t.mongodb.net/' || 'mongodb://localhost:27017/scheduler';

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
