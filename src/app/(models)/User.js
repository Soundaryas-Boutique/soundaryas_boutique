import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    phone: Number,
    address: String,
    resetToken: String,
    resetTokenExpiry: Date,
    state:String,
    country:String,
    pincode: String,
    city: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
