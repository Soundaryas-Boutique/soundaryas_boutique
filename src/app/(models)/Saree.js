import mongoose from "mongoose";

const sareeSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: null, // optional discount price
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["Silk", "Cotton", "Designer", "Banarasi", "Casual", "Other"], // example
    },
    tags: [String], // e.g., ["wedding", "red", "handloom"]
    colors: [String], // e.g., ["Red", "Blue", "Green"]
    sizes: [String], // e.g., ["5.5m", "6m with blouse"]
    material: {
      type: String, // e.g., "Pure Silk", "Cotton Blend"
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String },
      },
    ],
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Saree ||
  mongoose.model("Saree", sareeSchema, "sarees");
