import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { supabase } from "@/app/lib/supabase";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return <ProfileClient initialSession={null} initialUserInfo={null} />;
  }

  let userInfo = null;
  try {
    const { data, error } = await supabase()
      .from("users")
      .select("id, name, email, phone, role, address, city, state, country, pincode, createdAt")
      .eq("email", session.user.email)
      .maybeSingle();

    if (error) throw error;
    userInfo = data;
  } catch (error) {
    console.error("Error pre-fetching user info:", error);
  }

  return (
    <ProfileClient 
      initialSession={JSON.parse(JSON.stringify(session))} 
      initialUserInfo={userInfo} 
    />
  );
}
