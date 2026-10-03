import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

// GET → single message
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const { data: msg, error } = await supabase()
      .from("contacts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
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
    const { id } = await params;
    const { error } = await supabase().from("contacts").delete().eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting message:", err);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
