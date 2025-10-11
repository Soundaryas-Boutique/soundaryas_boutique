import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import User from "@/app/(models)/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "Admin") {
      // ✅ Add a check for unauthorized access
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the email from the URL's search parameters
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email parameter is missing" }, { status: 400 });
    }

    await connectDB();
    
    const user = await User.findOne({ email: email }).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Fix: Serialize the Mongoose object before returning
    const serializedUser = JSON.parse(JSON.stringify(user));

    return NextResponse.json(serializedUser, { status: 200 });

  } catch (error) {
    console.error("API Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}