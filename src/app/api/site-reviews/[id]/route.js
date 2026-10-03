import { supabase } from "../../../lib/supabase";
import { NextResponse } from 'next/server';

// --- UPDATE a review ---
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { id: _ignored, ...body } = await request.json();

    const { data: updatedReview, error } = await supabase()
      .from("site_reviews")
      .update(body)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!updatedReview) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Review updated!', review: updatedReview }, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ message: 'Error updating review' }, { status: 500 });
  }
}

// --- DELETE a review ---
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const { data: deletedReview, error } = await supabase()
      .from("site_reviews")
      .delete()
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!deletedReview) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Review deleted successfully!' }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ message: 'Error deleting review' }, { status: 500 });
  }
}
