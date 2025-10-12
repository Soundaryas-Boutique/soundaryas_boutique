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
    phone: { type: String, trim: true },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    exclusiveOffer: { type: Boolean, default: false },
    subscriptionType: {
      type: String,
      required: true,
      enum: ["Weekly", "Monthly", "Yearly"],
      default: "Monthly",
    },
  },
  { timestamps: true, collection: "subb" }
);

export default mongoose.models.Subscriber ||
  mongoose.model("Subscriber", SubscriberSchema);
