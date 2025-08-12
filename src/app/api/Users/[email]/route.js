import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import User from "@/app/(models)/User";

// GET /api/Users/:email
export async function GET(req, { params }) {
  try {
    await connectDB();
    const email = params.email;

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// PATCH /api/Users/:email
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const email = params.email;
    const body = await req.json();

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: body },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
