"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  FiPackage, 
  FiShoppingBag, 
  FiMail, 
  FiUsers, 
  FiBell, 
  FiMessageSquare,
  FiHome,
  FiCalendar,
  FiSend,
  FiScissors // --- CHANGE: Imported the Scissors icon ---
} from 'react-icons/fi';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: FiHome },
  { name: 'Products', href: '/admin/products', icon: FiPackage },
  { name: 'Orders', href: '/admin/orders', icon: FiShoppingBag },
  { name: 'Messages', href: '/admin/messages', icon: FiMessageSquare },
  { name: 'Subscribers', href: '/admin/subscribers', icon: FiMail },
  { name: 'Promotions', href: '/admin/email-marketing', icon: FiBell },
  { name: 'WhatsApp', href: '/admin/whatsapp-marketing', icon: FiSend },
  { name: 'Feedbacks', href: '/admin/feedback', icon: FiMessageSquare },
  { name: 'Vendors', href: '/admin/vendor', icon: FiUsers },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-10">Admin Dashboard</h2>
        <nav>
          <ul className="space-y-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 
                      ${isActive ? 'bg-red-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'}
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
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
  );
}