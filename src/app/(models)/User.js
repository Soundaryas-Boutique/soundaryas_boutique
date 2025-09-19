import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },

    // 🔹 Role-based access
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // 🔹 Address info
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    pincode: { type: String },

    // 🔹 Password reset
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
