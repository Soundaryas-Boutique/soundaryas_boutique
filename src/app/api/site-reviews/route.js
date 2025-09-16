import { connectReviewDB } from "../../lib/mongoose_review";
import siteReviewSchema from "../../(models)/SiteReview";


export async function GET() {
  const db = await connectReviewDB();
  const SiteReview = db.model("SiteReview", siteReviewSchema);

  console.log("📡 Fetching all reviews...");
  const reviews = await SiteReview.find().sort({ createdAt: -1 });
  return Response.json(reviews);
}

export async function POST(req) {
  const db = await connectReviewDB();
  const SiteReview = db.model("SiteReview", siteReviewSchema);

  const body = await req.json();
  console.log("📝 New review incoming:", body);

  const newReview = new SiteReview(body);
  await newReview.save();

  console.log("✅ Review saved:", newReview);
  return Response.json(newReview, { status: 201 });
}
