import { connectDB } from "../../lib/mongoose"; // CORRECTED import
import SiteReview from "../../(models)/SiteReview"; // CORRECTED import
import { NextResponse } from 'next/server';

// --- GET all reviews ---
export async function GET() {
  try {
    await connectDB(); // CORRECTED function call
    const reviews = await SiteReview.find({}).sort({ date: -1 }); // CORRECTED model name
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: 'Error fetching reviews' }, { status: 500 });
  }
}

// --- POST a new review ---
export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB(); // CORRECTED function call
    const newReview = await SiteReview.create(body); // CORRECTED model name
    return NextResponse.json({ message: 'Review Submitted!', review: newReview }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ message: 'Error submitting review' }, { status: 500 });
  }
}