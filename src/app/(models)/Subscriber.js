import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
  },
  { timestamps: true, collection: "subb" } // ✅ Using 'collection' option to match your previous code
);

export default mongoose.models.Subscriber ||
  mongoose.model("Subscriber", SubscriberSchema);