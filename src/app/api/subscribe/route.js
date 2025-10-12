import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import Subscriber from "@/app/(models)/Subscriber";

export async function POST(req) {
  try {
    await connectDB();
    const { email, profession, phone } = await req.json(); // ✅ Get phone from the body

    if (!email || !profession) {
      return NextResponse.json({ message: "Email and profession are required" }, { status: 400 });
    }

    const subscriber = new Subscriber({ email, profession, phone }); // ✅ Pass phone to the model
    await subscriber.save();

    return NextResponse.json({ message: "Subscribed successfully!" }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ message: "This email is already subscribed." }, { status: 409 });
    }
    console.error("❌ Subscription error:", error);
    return NextResponse.json({ message: "Server error", details: error.message }, { status: 500 });
  }
}