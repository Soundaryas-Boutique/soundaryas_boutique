import { supabase } from "@/app/lib/supabase";
import ReviewPageClient from "./ReviewPageClient";

export const metadata = {
  title: "Customer Reviews | Soundarya's Boutique",
  description:
    "Read what our customers say about our handwoven sarees, and share your own experience.",
};

export default async function ReviewPage() {
  // Public page: the reviews are fetched here so the list is in the first
  // response instead of arriving after the client boots and calls the API.
  const { data: reviews, error } = await supabase()
    .from("site_reviews")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Failed to fetch reviews:", error);
  }

  return <ReviewPageClient initialReviews={reviews ?? []} />;
}
