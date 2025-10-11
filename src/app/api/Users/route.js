import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/app/lib/mongoose";
import User from "@/app/(models)/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

// POST /api/Users — Create a user
export async function POST(req) {
  try {
    await connectDB();
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

    const duplicate = await User.findOne({ email: userData.email }).lean();
    if (duplicate) {
      return NextResponse.json(
        { message: "User already exists (Email)" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    await User.create(userData);

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

    if (session.user.role !== "Admin" && session.user.email !== emailToFetch) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!emailToFetch) {
      return NextResponse.json({ error: "Email parameter is missing" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: emailToFetch }).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const serializedUser = JSON.parse(JSON.stringify(user));
    return NextResponse.json(serializedUser, { status: 200 });

  } catch (error) {
    console.error("API Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}