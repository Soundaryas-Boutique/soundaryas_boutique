import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

const PROFILE_FIELDS = "name, phone, address, email";

/**
 * The email is taken from the session rather than the request: this route used
 * to read and write any profile by email with no authentication at all.
 */
async function sessionEmail() {
  const session = await getServerSession(authOptions);
  return session?.user?.email ?? null;
}

// Fetch profile
export async function GET() {
  try {
    const email = await sessionEmail();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: user, error } = await supabase()
      .from("users")
      .select(PROFILE_FIELDS)
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Update profile
export async function PUT(req) {
  try {
    const email = await sessionEmail();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, address } = await req.json();

    const { data: updatedUser, error } = await supabase()
      .from("users")
      .update({ name, phone, address })
      .eq("email", email)
      .select(PROFILE_FIELDS)
      .maybeSingle();

    if (error) throw error;
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
