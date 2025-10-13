import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import Complaint from "@/app/(models)/Complaint";

// GET all complaints (admin)
export async function GET() {
  try {
    await connectDB();
    const complaints = await Complaint.find({});
    return NextResponse.json({ complaints });
  } catch (error) {
    return NextResponse.json({ message: "Server error", details: error.message }, { status: 500 });
  }
}

// POST a complaint
export async function POST(req) {
  try {
    await connectDB();
    const { name, email, phone, orderId, complaintType, complaint } = await req.json();

    if (!name || !email || !complaintType || !complaint) {
      return NextResponse.json({ message: "Required fields missing" }, { status: 400 });
    }

    const newComplaint = new Complaint({ name, email, phone, orderId, complaintType, complaint });
    await newComplaint.save();

    return NextResponse.json({ message: "Complaint submitted successfully!" }, { status: 201 });
  } catch (error) {
    console.error("❌ Complaint submission error:", error);
    return NextResponse.json({ message: "Server error", details: error.message }, { status: 500 });
  }
}
