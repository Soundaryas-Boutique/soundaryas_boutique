"use client";
import React from "react";
import { 
  FiUser, 
  FiPackage, 
  FiMapPin, 
  FiLayout,
  FiChevronRight
} from "react-icons/fi";
import Link from "next/link";
import { useSession } from "next-auth/react";

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "Admin";

  const menuItems = [
    { id: "profile", label: "Profile Details", icon: FiUser },
    { id: "orders", label: "My Orders", icon: FiPackage },
    { id: "addresses", label: "Saved Addresses", icon: FiMapPin },
  ];

  return (
    <aside className="w-full lg:w-64 flex flex-col gap-5">
      {/* Sidebar Navigation */}
      <div className="bg-white border border-gray-100 p-2">
        <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible no-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap flex items-center gap-3 px-5 py-3.5 transition-all duration-200 ${
                activeTab === item.id 
                  ? "bg-gray-50 text-primary border-r-2 border-secondary" 
                  : "text-grey-medium hover:text-primary hover:bg-gray-50/50"
              }`}
            >
              <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-secondary" : "group-hover:text-primary"}`} />
              <span className="text-[10px] uppercase tracking-widest font-bold">
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Admin Quick Link */}
      {isAdmin && (
        <Link
          href="/admin/products"
          className="flex items-center justify-between bg-gray-900 text-white p-4 hover:bg-black transition-colors"
        >
          <div className="flex items-center gap-3">
            <FiLayout className="w-4 h-4 text-secondary" />
            <span className="text-[9px] uppercase tracking-widest font-bold">Admin Dashboard</span>
          </div>
          <FiChevronRight className="w-3 h-3 text-secondary" />
        </Link>
      )}
    </aside>
  );
};

export default ProfileSidebar;
