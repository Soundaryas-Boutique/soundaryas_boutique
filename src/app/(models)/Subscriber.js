import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    profession: {
      type: String,
      required: true,
      enum: ["Doctor", "Teacher", "Engineer", "Student", "Other"],
      default: "Other",
    },
    phone: { type: String, trim: true }, // ✅ Added phone number field
  },
  { timestamps: true, collection: "subb" }
);

export default mongoose.models.Subscriber ||
  mongoose.model("Subscriber", SubscriberSchema);