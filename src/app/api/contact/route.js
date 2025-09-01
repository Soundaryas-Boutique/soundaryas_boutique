import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose2";
import Contact from "@/app/(models)/Contact";

// POST handler for contact form submissions
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, phone, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const newContact = new Contact({
      name,
      phone,
      email,
      subject,
      message,
    });

    await newContact.save();

    return NextResponse.json(
      { success: true, message: "Form submitted successfully!" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error saving contact form:", err);
    return NextResponse.json(
      { error: "Failed to submit contact form." },
      { status: 500 }
    );
  }
}
