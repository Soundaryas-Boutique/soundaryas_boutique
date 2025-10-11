import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import Subscriber from "@/app/(models)/Subscriber";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

// Helper function to check admin status
const isAdmin = async (session) => {
  return session && session.user.role === "Admin";
};

// GET: Fetch ALL subscribers for Admin Dashboard
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!await isAdmin(session)) {
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