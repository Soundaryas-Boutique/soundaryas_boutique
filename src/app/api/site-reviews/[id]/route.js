import { connectReviewDB } from "../../../lib/mongoose_review";
import siteReviewSchema from "../../../(models)/SiteReview";
import mongoose from "mongoose";

const { Types } = mongoose;

export async function GET(req, { params }) {
  try {
    const db = await connectReviewDB();
    const SiteReview = db.model("SiteReview", siteReviewSchema);

    const { id } = params;
    if (!Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
    }

    const review = await SiteReview.findById(id);
    if (!review) {
      return new Response(JSON.stringify({ error: "Review not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(review), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const db = await connectReviewDB();
    const SiteReview = db.model("SiteReview", siteReviewSchema);

    const { id } = params;
    if (!Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
    }

    const body = await req.json();
    const updated = await SiteReview.findByIdAndUpdate(
      id,
      {
        comment: body.comment,
        service: body.service,
        recommend: body.recommend,
        rating: body.rating,
      },
      { new: true }
    );

    if (!updated) {
      return new Response(JSON.stringify({ error: "Review not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, review: updated }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const db = await connectReviewDB();
    const SiteReview = db.model("SiteReview", siteReviewSchema);

    const { id } = params;
    if (!Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
    }

    const deleted = await SiteReview.findByIdAndDelete(id);
    if (!deleted) {
      return new Response(JSON.stringify({ error: "Review not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, deleted }));
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
