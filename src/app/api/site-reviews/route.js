// --- FIX: Changed to a default import (no curly braces) ---
import connectReviewDB from "../../lib/mongoose"; 
import siteReviewSchema from "../../(models)/SiteReview";
import { NextResponse } from 'next/server';

export async function GET() {
  // This function is likely working, but we leave the logs for good measure.
  try {
    console.log("API ROUTE: GET request received.");
    await connectReviewDB();
    console.log("API ROUTE: GET - Database connected.");
    const reviews = await siteReviewSchema.find({}).sort({ date: -1 });
    console.log(`API ROUTE: GET - Found ${reviews.length} reviews.`);
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("!!! GET Error:", error);
    return NextResponse.json({ message: 'Error fetching reviews' }, { status: 500 });
  }
}

export async function POST(request) {
  // --- THIS IS THE MODIFIED PART ---
  // We have removed the try...catch to see the raw error.

  console.log("\n--- NEW REVIEW SUBMISSION ---");
  console.log("1. POST request received.");

  const body = await request.json();
  console.log("2. Request body parsed:", body);

  await connectReviewDB();
  console.log("3. Database connection successful.");

  const newReview = await siteReviewSchema.create(body);
  console.log("4. Review successfully created in database:", newReview);

  return NextResponse.json({ message: 'Review Submitted!', review: newReview }, { status: 201 });
}