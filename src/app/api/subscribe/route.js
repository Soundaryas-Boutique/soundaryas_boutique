import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose2";
import Subscriber from "@/app/(models)/Subscriber";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const subscriber = new Subscriber({ email });
    await subscriber.save();

    return NextResponse.json({ message: "Subscribed successfully!" }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) { // Check for duplicate key error (MongoDB)
      return NextResponse.json({ message: "This email is already subscribed." }, { status: 409 });
    }
    console.error("❌ Subscription error:", error);
    return NextResponse.json({ message: "Server error", details: error.message }, { status: 500 });
  }
}