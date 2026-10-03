import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { isAdmin } from "@/app/lib/authUtils";

export async function GET(req) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the email from the URL's search parameters
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email parameter is missing" }, { status: 400 });
    }

    const { data: user, error } = await supabase()
      .from("users")
      .select("id, name, email, phone, role, address, city, state, country, pincode, createdAt, updatedAt")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.error("API Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
