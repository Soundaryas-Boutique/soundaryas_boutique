// src/app/admin/layout.jsx

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin panel for Soundarya's Boutique",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>
          <nav>
            <ul className="space-y-4">
              <li><a href="/admin/dashboard">Dashboard</a></li>
              <li><a href="/admin/products">Products</a></li>
              <li><a href="/admin/orders">Orders</a></li>
              <li><a href="/admin/messages">Messages</a></li>
              <li><a href="/admin/subscribers">Subscribers</a></li>
              <li><a href="/admin/email-marketing">Email</a></li>

              {/* 👇 New Feedback Section */}
              <li><a href="/admin/feedback">Feedback</a></li>
            </ul>
          </nav>
        </div>

        {/* Back to Store Button */}
        <div className="mt-10">
          <a
            href="/"
            className="block w-full text-center bg-white text-gray-900 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            ← Back to Store
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
