// src/app/api/Users/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/app/lib/mongoose"; // <-- central connection helper
import User from "@/app/(models)/User";

// POST /api/Users
export async function POST(req) {
  try {
    await connectDB(); // <-- connect once before DB operations

    const body = await req.json();
    const userData = body.formData;

    // Validate required fields
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

    // Check for duplicate email
    const duplicate = await User.findOne({ email: userData.email }).lean();
    if (duplicate) {
      return NextResponse.json(
        { message: "User already exists (Email)" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    // Create user
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
