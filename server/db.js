import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    // Timeout quickly so the server starts fast even if MongoDB isn't running
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rstracking', {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Server will run in MOCK DATABASE MODE. User data will not be persisted.');
  }
};

export default connectDB;
