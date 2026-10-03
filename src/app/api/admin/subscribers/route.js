import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { isAdmin } from "@/app/lib/authUtils";

// GET: Fetch ALL subscribers for Admin Dashboard
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  try {
    const { data: subscribers, error } = await supabase()
      .from("subscribers")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return NextResponse.json(subscribers);
  } catch (err) {
    console.error("Admin GET Subscribers Error:", err);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}
