import { connectDB } from "../../../lib/mongoose"; // CORRECTED import
import SiteReview from "../../../(models)/SiteReview"; // CORRECTED import
import { NextResponse } from 'next/server';

// --- UPDATE a review ---
export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();
  try {
    await connectDB(); // CORRECTED function call
    const updatedReview = await SiteReview.findByIdAndUpdate(id, body, { new: true }); // CORRECTED model name
    
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
  const { id } = params;
  try {
    await connectDB(); // CORRECTED function call
    const deletedReview = await SiteReview.findByIdAndDelete(id); // CORRECTED model name
    
    if (!deletedReview) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Review deleted successfully!' }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ message: 'Error deleting review' }, { status: 500 });
  }
}