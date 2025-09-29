import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose2";
import User from "@/app/(models)/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    const emailToFetch = req.nextUrl.searchParams.get("email");

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🐛 Fix: Allow an authenticated user to fetch their own data
    // Only allow admins to fetch other users' data
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