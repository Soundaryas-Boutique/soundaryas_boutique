import { redirect } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { isAdmin } from "@/app/lib/authUtils";
import NewsletterDashboard from "./NewsletterDashboard";

export const metadata = {
  title: "Newsletter Subscribers | Admin",
};

export default async function NewsletterPage() {
  // Layouts and pages render concurrently, so the admin layout's redirect
  // does not stop this query from running.
  if (!(await isAdmin())) {
    redirect("/Denied");
  }

  const { data: subscribers, error } = await supabase()
    .from("subscribers")
    .select("id, email, phone, profession, gender, subscriptionType, exclusiveOffer, createdAt")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching subscribers:", error);
    return (
      <p role="alert" className="p-6 text-red-500">
        Failed to load subscribers. {error.message}
      </p>
    );
  }

  return <NewsletterDashboard subscribers={subscribers} />;
}
