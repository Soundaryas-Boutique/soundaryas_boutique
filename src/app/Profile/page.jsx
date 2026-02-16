"use client";
import { useSession } from "next-auth/react";
import useUserInfo from "@/app/hooks/useUserInfo";
import Link from "next/link";
import ProfileNav from "../../../components/ProfileNav";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const email = session?.user?.email;

  const { userInfo, loading, error } = useUserInfo(email);

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
    <div className="flex flex-col md:flex-row p-4">
      {/* Left side */}
      <ProfileNav />

      {/* Right side */}
      <div className="ml-9">
        <h1 className="text-2xl font-bold mb-4">Account Details</h1>

        <div>
          <p className="mb-2">{userInfo?.name}</p>
          <p className="mb-2">{userInfo?.phone}</p>
          <p className="mb-2">{userInfo?.email}</p>
        </div>

        <div className="mt-24">
          <h1 className="text-2xl font-bold mb-4">Address</h1>
          <p className="mb-2">
            {userInfo?.address}, {userInfo?.city},
            <br />
            {userInfo?.state}, {userInfo?.country}, {userInfo?.pincode}
          </p>
        </div>
      </div>
    </div>
  );
}