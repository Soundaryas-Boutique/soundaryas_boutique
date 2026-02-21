import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import Subscriber from "@/app/(models)/Subscriber";
import { isAdmin } from "@/app/lib/authUtils";

// GET: Fetch ALL subscribers for Admin Dashboard
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  await connectDB();
  try {
    const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });

    const serializedSubscribers = JSON.parse(JSON.stringify(subscribers));
    return NextResponse.json(serializedSubscribers);
  } catch (err) {
    console.error("Admin GET Subscribers Error:", err);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}