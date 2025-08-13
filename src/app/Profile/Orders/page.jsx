"use client";
import { useSession } from "next-auth/react";
import useUserInfo from "@/app/hooks/useUserInfo";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const email = session?.user?.email;

  const { userInfo, loading, error } = useUserInfo(email);

 
  console.log(userInfo);

  if (status === "unauthenticated") {
    return (
      <div className="relative items-center justify-center flex flex-col h-screen -top-20">
        <p>Please Login to continue.</p>
        <Link href="/signin">
          <button className="text-blue-500">Sign In</button>
        </Link>
      </div>
    );
  }
  
  if (error) return <p>{error.message}</p>;

  return (
    <div className="flex flex-col md:flex-row  p-4">
      {/*Left side*/}
      <div className="w-80 border-r h-screen  p-4">
      
        <ul className="space-y-2">
          <li className="hover:bg-gray-100 p-2 rounded">
            <Link href="/Profile">Profile</Link>
          </li>
          <li className="hover:bg-gray-100 p-2 rounded">
            <Link href="/profile/settings">Settings</Link>
          </li>
          <li className="hover:bg-gray-100 p-2 rounded">
            <Link href="/Profile/Orders">Orders</Link>
          </li>
        </ul>
      </div>


      {/*Right side*/}
      <div className="ml-9">
        <h1 className="text-2xl font-bold mb-4">Profile Information</h1>
        <p className="mb-2"><strong>Email:</strong> {userInfo?.email}</p>
    </div>
    </div>
  );
}
