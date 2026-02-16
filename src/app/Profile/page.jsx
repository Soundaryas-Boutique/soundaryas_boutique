import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/mongoose";
import User from "@/app/(models)/User";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return <ProfileClient initialSession={null} initialUserInfo={null} />;
  }

  let userInfo = null;
  try {
    await connectDB();
    userInfo = await User.findOne({ email: session.user.email }).lean();
    userInfo = JSON.parse(JSON.stringify(userInfo));
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
