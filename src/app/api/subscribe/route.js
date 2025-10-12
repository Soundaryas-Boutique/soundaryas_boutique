import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import Subscriber from "@/app/(models)/Subscriber"; // relative path from api/subscribe

// GET all subscribers
export async function GET() {
  try {
    await connectDB();
    const subscribers = await Subscriber.find({});
    return NextResponse.json({ subscribers });
  } catch (error) {
    return NextResponse.json({ message: "Server error", details: error.message }, { status: 500 });
  }
}

// POST new subscriber
export async function POST(req) {
  try {
    await connectDB();
    const { email, profession, phone, gender, exclusiveOffer, subscriptionType } = await req.json();

    if (!email || !profession || !gender || !subscriptionType) {
      return NextResponse.json({ message: "Required fields missing" }, { status: 400 });
    }

    const subscriber = new Subscriber({
      email,
      profession,
      phone,
      gender,
      exclusiveOffer: exclusiveOffer || false,
      subscriptionType,
    });

    await subscriber.save();
    return NextResponse.json({ message: "Subscribed successfully!" }, { status: 201 });
  } catch (error) {
    if (error.code === 11000)
      return NextResponse.json({ message: "Email already subscribed" }, { status: 409 });
    return NextResponse.json({ message: "Server error", details: error.message }, { status: 500 });
  }
}
