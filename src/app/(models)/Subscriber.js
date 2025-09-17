// src/app/(models)/Subscriber.js
import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, trim: true },
    exclusive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Explicitly tell Mongoose to use 'subb' collection
export default mongoose.models.Subscriber ||
  mongoose.model("Subscriber", SubscriberSchema, "subb");
