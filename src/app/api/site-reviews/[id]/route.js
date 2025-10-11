// --- FIX: Changed to a default import (no curly braces) ---
import connectReviewDB from "../../../lib/mongoose"; 
import siteReviewSchema from "../../../(models)/SiteReview";
import { NextResponse } from 'next/server';


export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();
  try {
    await connectReviewDB();
    const updatedReview = await siteReviewSchema.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedReview) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Review updated!', review: updatedReview }, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ message: 'Error updating review' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    await connectReviewDB();
    const deletedReview = await siteReviewSchema.findByIdAndDelete(id);
    
    if (!deletedReview) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Review deleted successfully!' }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ message: 'Error deleting review' }, { status: 500 });
  }
}