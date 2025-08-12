import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import User from "@/app/(models)/User";

// Fetch profile
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const user = await User.findOne({ email }).select("name phone address email");
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
    await connectDB();
    const body = await req.json();
    const { email, name, phone, address } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { name, phone, address },
      { new: true }
    ).select("name phone address email");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
