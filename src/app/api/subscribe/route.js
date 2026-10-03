import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

// GET all subscribers
export async function GET() {
  try {
    const { data: subscribers, error } = await supabase()
      .from("subscribers")
      .select("*");

    if (error) throw error;
    return NextResponse.json({ subscribers });
  } catch (error) {
    return NextResponse.json({ message: "Server error", details: error.message }, { status: 500 });
  }
}

// POST new subscriber
export async function POST(req) {
  try {
    const { email, profession, phone, gender, exclusiveOffer, subscriptionType } = await req.json();

    if (!email || !profession || !gender || !subscriptionType) {
      return NextResponse.json({ message: "Required fields missing" }, { status: 400 });
    }

    const { error } = await supabase()
      .from("subscribers")
      .insert({
        // The Mongoose schema lowercased this; the column is plain text.
        email: email.toLowerCase(),
        profession,
        phone,
        gender,
        exclusiveOffer: exclusiveOffer || false,
        subscriptionType,
      });

    // 23505 = unique_violation
    if (error?.code === "23505") {
      return NextResponse.json({ message: "Email already subscribed" }, { status: 409 });
    }
    if (error) throw error;

    return NextResponse.json({ message: "Subscribed successfully!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server error", details: error.message }, { status: 500 });
  }
}
