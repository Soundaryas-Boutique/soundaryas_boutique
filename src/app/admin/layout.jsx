import { Fraunces } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { ADMIN_ROLE } from "@/app/lib/authUtils";
import AdminNav from "../../../components/admin/AdminNav";

// Loaded here rather than in the root layout so storefront visitors never
// download it. Fraunces is a soft old-style serif -- warmer and grittier
// than the storefront's Yeseva One, which suits a workroom.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
  variable: "--font-fraunces",
});

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin panel for Soundarya's Boutique",
};

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  // Server-side guard to prevent "blinking" or "flashing" for unauthorized users
  if (!session || session.user.role !== ADMIN_ROLE) {
    redirect("/Denied");
  }

  return (
    <div className={`${fraunces.variable} flex min-h-screen bg-grey-light`}>
      <AdminNav />

      {/* pb-24 on phones clears the fixed tab bar. */}
      <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-6 md:px-8 md:pb-10 md:pt-8">
        {children}
      </main>
    </div>
  );
}
