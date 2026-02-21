import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "../../../components/admin/AdminSidebar"; // ✅ Import the new sidebar component

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin panel for Soundarya's Boutique",
};

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  // Server-side guard to prevent "blinking" or "flashing" for unauthorized users
  if (!session || session.user.role !== "admin") {
    redirect("/Denied");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}