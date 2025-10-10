import AdminSidebar from "../../../components/admin/AdminSidebar"; // ✅ Import the new sidebar component

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin panel for Soundarya's Boutique",
};

export default function AdminLayout({ children }) {
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