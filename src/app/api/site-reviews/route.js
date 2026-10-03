import { supabase } from "../../lib/supabase";
import { NextResponse } from 'next/server';

// --- GET all reviews ---
export async function GET() {
  try {
    const { data: reviews, error } = await supabase()
      .from("site_reviews")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: 'Error fetching reviews' }, { status: 500 });
  }
}

// --- POST a new review ---
export async function POST(request) {
  try {
    // id and date are assigned by the database.
    const { id, date, ...body } = await request.json();

    const { data: review, error } = await supabase()
      .from("site_reviews")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ message: 'Review Submitted!', review }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ message: 'Error submitting review' }, { status: 500 });
  }
}
