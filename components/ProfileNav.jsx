"use client";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const ProfileNav = () => {
  const { data: session } = useSession();

  // Check if user is admin
  const isAdmin = session?.user?.role === "Admin";

  return (
    <div>
      <div className="w-80 border-r h-screen p-4">
        <ul className="space-y-2">
          <li className="hover:bg-gray-100 p-2 rounded">
            <Link href="/Profile">Profile</Link>
          </li>
          <li className="hover:bg-gray-100 p-2 rounded">
            <Link href="/Profile/settings">Settings</Link>
          </li>
          <li className="hover:bg-gray-100 p-2 rounded">
            <Link href="/Profile/Orders">Orders</Link>
          </li>
          <li className="hover:bg-gray-100 p-2 rounded">
            <Link href="/Profile/Saved-Cards">Saved Cards</Link>
          </li>
          <li className="hover:bg-gray-100 p-2 rounded">
            <Link href="/logoutsecurity">Logout</Link>
          </li>
        </ul>

        {/* Admin button */}
        {isAdmin && (
          <div className="mt-6">
            <Link
              href="/admin/products"
              className="block w-full text-center bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
            >
              Admin Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileNav;
