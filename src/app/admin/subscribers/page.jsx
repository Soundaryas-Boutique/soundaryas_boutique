import { redirect } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { isAdmin } from "@/app/lib/authUtils";
import SubscribersDashboard from "../../../../components/admin/SubscribersDashboard";

export const metadata = {
  title: "Subscribers | Admin",
};

export default async function AdminSubscribersPage() {
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
      <p role="alert" className="text-red-700">
        Failed to load subscribers. {error.message}
      </p>
    );
  }

  return <SubscribersDashboard subscribers={subscribers} />;
}
