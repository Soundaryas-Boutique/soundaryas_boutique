"use client";
import { useSession } from "next-auth/react";
import useUserInfo from "@/app/hooks/useUserInfo";
import Link from "next/link";
import ProfileNav from "../../../components/ProfileNav";
// ADDITION: Imported the Calendar icon for the new button
import { Calendar } from "lucide-react";
import { Ruler } from "lucide-react";
import { PackageSearch } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const email = session?.user?.email;

  const { userInfo, loading, error } = useUserInfo(email);
  console.log(status);
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
        
        {/* Complaint Section */}
        <div className="mt-16">
          <h1 className="text-2xl font-bold mb-4">Need Help?</h1>
          <p className="mb-4 text-gray-600">
            If you have any issues with your order or service, you can register
            a complaint below.
          </p>
          <Link href="/Profile/register-complaint">
            <button className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition">
              Register a Complaint
            </button>
          </Link>
        </div>


        {/* New, dedicated section for booking an appointment */}
        <div className="mt-16 pt-8 border-t">
          <h1 className="text-2xl font-bold mb-4">Personal Styling Session</h1>
          
          {/* The new "catchy" sentence */}
          <p className="mb-6 text-gray-600 max-w-md">
            Schedule your personal styling session and let our experts help you find the perfect look for any occasion.
          </p>
          
          {/* The new, improved button */}
          <Link href="/Profile/AppointmentForm">
            <button className="inline-flex items-center gap-2 bg-[#B22222] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-[#8B0000] hover:-translate-y-0.5 transition-all duration-300">
              <Calendar size={18} />
              Book a Styling Session
            </button>
          </Link>
        </div>


        <div className="mt-16 pt-8 border-t">
          <h1 className="text-2xl font-bold mb-4">Custom Tailoring</h1>

          <p className="mb-6 text-gray-600 max-w-md">
            Your perfect fit starts here. Provide your measurements and let our artisans craft a garment exclusively for you.
          </p>

          {/* --- CHANGE: Wrapped buttons in a flex container for alignment --- */}
          <div className="flex items-center gap-4">

            {/* Submit Measurements Button (Primary) */}
            <Link href="/Profile/tailoring-form">
              <button className="inline-flex items-center gap-2 bg-[#B22222] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-[#8B0000] hover:-translate-y-0.5 transition-all duration-300">
                <Ruler size={18} />
                Submit Measurements
              </button>
            </Link>

            {/* --- NEW: "View Progress" Button Added --- */}
            <Link href="/Profile/tailoring-progress">
              <button className="inline-flex items-center gap-2 bg-white text-[#B22222] font-semibold px-6 py-3 rounded-lg shadow-md border-2 border-[#B22222] hover:bg-[#FEECEB] hover:-translate-y-0.5 transition-all duration-300">
                <PackageSearch size={18} />
                View Progress
              </button>
            </Link>

          </div>
        </div>



      </div>
    </div>
  );
}