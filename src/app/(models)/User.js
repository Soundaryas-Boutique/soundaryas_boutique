import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    pincode: { type: String },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);