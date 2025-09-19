// src/app/admin/layout.jsx

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin panel for Soundarya's Boutique",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>
        <nav>
          <ul className="space-y-4">
            <li><a href="/admin/dashboard">Dashboard</a></li>
            <li><a href="/admin/products">Products</a></li>
            <li><a href="/admin/orders">Orders</a></li>
            <li><a href="/admin/users">Users</a></li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
