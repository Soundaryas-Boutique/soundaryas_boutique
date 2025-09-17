// src/app/lib/mongoose_subb.js
import mongoose from "mongoose";

let isConnected = false;

const dbConnect = async () => {
  if (isConnected) return;

  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "subscribe",
    });
    isConnected = conn.connections[0].readyState;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

export default dbConnect;
