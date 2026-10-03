import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { supabase } from "@/app/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { ADMIN_ROLE } from "@/app/lib/authUtils";

const PROFILE_FIELDS =
  "id, name, email, phone, role, address, city, state, country, pincode, createdAt, updatedAt";

// POST /api/Users — Create a user
export async function POST(req) {
  try {
    const body = await req.json();
    const userData = body.formData;

    if (
      !userData?.name ||
      !userData?.email ||
      !userData?.password ||
      !userData?.phone ||
      !userData?.address||
      !userData?.state ||
      !userData?.country ||
      !userData?.pincode ||
      !userData?.city
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const { name, email, password, phone, address, city, state, country, pincode } = userData;

    const { error } = await supabase()
      .from("users")
      .insert({
        name,
        email,
        phone,
        address,
        city,
        state,
        country,
        pincode,
        password: await bcrypt.hash(password, 10),
      });

    // 23505 = unique_violation, i.e. the email is already registered.
    if (error?.code === "23505") {
      return NextResponse.json(
        { message: "User already exists (Email)" },
        { status: 409 }
      );
    }
    if (error) throw error;

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/Users?email=...
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    const emailToFetch = req.nextUrl.searchParams.get("email");

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== ADMIN_ROLE && session.user.email !== emailToFetch) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!emailToFetch) {
      return NextResponse.json({ error: "Email parameter is missing" }, { status: 400 });
    }

    const { data: user, error } = await supabase()
      .from("users")
      .select(PROFILE_FIELDS)
      .eq("email", emailToFetch)
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
