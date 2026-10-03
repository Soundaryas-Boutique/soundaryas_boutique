import { redirect } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { isAdmin } from "@/app/lib/authUtils";
import ReviewsDashboard from "./ReviewsDashboard";

export const metadata = {
  title: "Product Reviews | Admin",
};

export default async function ReviewsDashboardPage() {
  // Layouts and pages render concurrently, so the admin layout's redirect
  // does not stop this query from running.
  if (!(await isAdmin())) {
    redirect("/Denied");
  }

  const { data: reviews, error } = await supabase()
    .from("site_reviews")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Failed to fetch dashboard data:", error);
    return (
      <p role="alert" className="p-6 text-red-500">
        Failed to load reviews. {error.message}
      </p>
    );
  }

  return <ReviewsDashboard reviews={reviews} />;
}
