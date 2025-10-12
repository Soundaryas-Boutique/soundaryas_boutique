import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String },
    orderId: { type: String },
    complaintType: {
      type: String,
      required: true,
      enum: ["Delivery Delay", "Product Quality", "Payment Issue", "Customer Service", "Others"],
    },
    complaint: { type: String, required: true },
  },
  { timestamps: true, collection: "complaints" }
);

export default mongoose.models.Complaint || mongoose.model("Complaint", ComplaintSchema);
