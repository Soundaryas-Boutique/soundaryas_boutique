import mongoose from "mongoose";

const MONGODB_URI2 = process.env.MONGODB_URI2;

if (!MONGODB_URI2) {
  throw new Error("❌ Please define the MONGODB_URI2 environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI2).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
q