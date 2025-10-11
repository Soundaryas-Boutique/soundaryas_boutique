import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import Contact from "@/app/(models)/Contact";

// GET → single message
export async function GET(req, { params }) {
  try {
    await connectDB();
    const msg = await Contact.findById(params.id);
    if (!msg) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }
    return NextResponse.json(msg);
  } catch (err) {
    console.error("Error fetching single message:", err);
    return NextResponse.json({ error: "Failed to fetch message" }, { status: 500 });
  }
}

// DELETE → delete message
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await Contact.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting message:", err);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
