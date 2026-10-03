import HomePage from "./HomePage";
import { supabase } from "@/app/lib/supabase";
import NewsletterSection from "../../components/NewsletterSection"; // ✅ Import newsletter section

export default async function Page() {
  const { data: sarees, error } = await supabase().from("sarees").select("*");
  if (error) throw error;

  return (
    <>
      <HomePage sarees={sarees} />
 {/* ✅ Render the newsletter section on the homepage */}
    </>
  );
}