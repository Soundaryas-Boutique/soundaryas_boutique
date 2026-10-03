import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

// GET → fetch all messages
export async function GET() {
  try {
    const { data: messages, error } = await supabase()
      .from("contacts")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return NextResponse.json(messages);
  } catch (err) {
    console.error("Error fetching contact messages:", err);
    return NextResponse.json(
      { error: "Failed to fetch contact messages." },
      { status: 500 }
    );
  }
}

// POST → save new contact form submission
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const { error } = await supabase()
      .from("contacts")
      .insert({ name, phone, email, subject, message });

    if (error) throw error;

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
