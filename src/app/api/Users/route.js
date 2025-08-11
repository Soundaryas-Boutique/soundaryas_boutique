import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/app/lib/mongoose";
import User from "@/app/(models)/User";

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
      !userData?.address
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
    await connectDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email query parameter is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
