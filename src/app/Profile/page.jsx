// src/app/Profile/page.jsx
"use client";
import { useSession } from "next-auth/react";
import useUserInfo from "@/app/hooks/useUserInfo";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const email = session?.user?.email;

  const { userInfo, loading, error } = useUserInfo(email);

  if (status === "loading" || loading) 
    return(
      <div className="relative items-center justify-center flex flex-col h-screen -top-20">
        <p>Please Login to continue.</p>
        <Link href="/signin">
          <button className="text-blue-500">Sign In</button>
          </Link>
      </div>
    );
 
 
 
    if (error) return <p>{error.message}</p>;

  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Name:</strong> {userInfo?.name}</p>
      <p><strong>Email:</strong> {userInfo?.email}</p>
      <p><strong>Phone:</strong> {userInfo?.phone}</p>
      <p><strong>Address:</strong> {userInfo?.address}</p>
    </div>
  );
}
