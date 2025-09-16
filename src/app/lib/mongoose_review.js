import mongoose from "mongoose";

let reviewConn = null;

export async function connectReviewDB() {
  if (reviewConn) return reviewConn;

  try {
    console.log("Connecting to MongoDB (reviews)...");
    reviewConn = await mongoose.createConnection(process.env.MONGODB_URI3, {
      dbName: "boutique",
    });
    console.log("✅ Reviews DB connected!");
    return reviewConn;
  } catch (err) {
    console.error("❌ Reviews DB connection error:", err);
    throw err;
  }
}
