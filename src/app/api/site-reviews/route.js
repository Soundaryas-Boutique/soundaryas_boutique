import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose2"; // Make sure this path is correct
import SiteReview from "@/app/(models)/SiteReview";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { rating, comment, author } = body;

    if (!rating || !comment || !author) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newReview = new SiteReview({ rating, comment, author });
    await newReview.save();

    return NextResponse.json(
        { success: true, message: "Feedback submitted successfully!" },
        { status: 201 }
    );

  } catch (error) {
    console.error("❌ Site review submission error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
