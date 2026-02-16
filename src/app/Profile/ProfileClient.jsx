"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import useUserInfo from "@/app/hooks/useUserInfo";
import Link from "next/link";
import ProfileSidebar from "../../../components/ProfileSidebar";
import { PersonalInfoSection, OrdersSection, AddressSection } from "../../../components/ProfileSections";

export default function ProfilePage({ initialUserInfo, initialSession }) {
  const { data: sessionData, status: sessionStatus } = useSession();
  
  // Prioritize server-session then client-session
  const session = initialSession || sessionData;
  const status = initialSession ? "authenticated" : sessionStatus;
  
  const [activeTab, setActiveTab] = useState("profile");
  const email = session?.user?.email;

  const { userInfo: fetchedUserInfo, loading, error } = useUserInfo(email);
  const userInfo = fetchedUserInfo || initialUserInfo;

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-ivory border-t-secondary rounded-full animate-spin"></div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-grey-medium font-bold">Loading Account...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="max-w-[1440px] mx-auto py-20 px-6 text-center bg-white min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-secondary text-primary uppercase tracking-tighter mb-4">Guest View</h1>
        <p className="text-grey-medium font-main italic mb-10 max-w-md"> Please sign in to access your curated collection, order history, and saved addresses. </p>
        <Link href="/signin">
          <button className="bg-primary text-ivory px-12 py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-secondary transition-all shadow-premium">
            Enter Boutique
          </button>
        </Link>
      </main>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <PersonalInfoSection userInfo={userInfo} loading={loading} />;
      case "orders":
        return <OrdersSection />;
      case "addresses":
        return <AddressSection userInfo={userInfo} loading={loading} />;
      default:
        return <PersonalInfoSection userInfo={userInfo} loading={loading} />;
    }
  };

  return (
    <main className="max-w-[1440px] mx-auto py-10 lg:py-14 px-6 md:px-12 bg-white min-h-screen animate-fadeIn">
      {/* Header & Breadcrumbs (Reduced Space) */}
      <div className="mb-10 border-b border-gray-100 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-secondary text-primary tracking-tight uppercase">
            Hello, <span className="text-secondary font-medium">
              {loading && !userInfo ? "..." : (userInfo?.name?.split(" ")[0] || session?.user?.name?.split(" ")[0] || "User")}
            </span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-grey-medium mt-2">
            Explore your boutique account and orders
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Navigation Sidebar */}
        <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Content Area */}
        <div className="flex-1 lg:max-w-4xl">
          <div className="bg-white min-h-[500px]">
            {renderContent()}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-12 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] uppercase tracking-widest font-bold text-center">
          Notice: {error.message}. Some details may not be available.
        </div>
      )}
    </main>
  );
}