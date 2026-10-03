import { redirect } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { isAdmin } from "@/app/lib/authUtils";
import MessagesDashboard from "./MessagesDashboard";

export const metadata = {
  title: "Contact Messages | Admin",
};

export default async function AdminMessagesPage() {
  // Layouts and pages render concurrently, so the admin layout's redirect
  // does not stop this query from running.
  if (!(await isAdmin())) {
    redirect("/Denied");
  }

  const { data: messages, error } = await supabase()
    .from("contacts")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching messages:", error);
    return (
      <p role="alert" className="p-6 text-red-500">
        Failed to load messages. {error.message}
      </p>
    );
  }

  return <MessagesDashboard initialMessages={messages} />;
}
