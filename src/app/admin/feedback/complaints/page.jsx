"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useRouter } from "next/navigation";

export default function ComplaintPage() {
  const router = useRouter();

  const allCategories = [
    "Delivery Delay",
    "Product Quality",
    "Payment Issue",
    "Customer Service",
    "Others",
  ];

  const [complaints] = useState([
    { id: 1, category: "Delivery Delay", message: "Order came late", date: "2025-10-05" },
    { id: 2, category: "Delivery Delay", message: "Package delayed by 2 days", date: "2025-10-06" },
    { id: 3, category: "Product Quality", message: "Fabric was different than shown", date: "2025-10-06" },
    { id: 4, category: "Product Quality", message: "Color faded after first wash", date: "2025-10-07" },
    { id: 5, category: "Product Quality", message: "Wrong size delivered", date: "2025-10-07" },
    { id: 6, category: "Payment Issue", message: "Payment not reflected", date: "2025-10-07" },
    { id: 7, category: "Customer Service", message: "Support didn't respond", date: "2025-10-08" },
    { id: 8, category: "Customer Service", message: "Rude staff on call", date: "2025-10-08" },
    { id: 9, category: "Others", message: "Wrong item delivered", date: "2025-10-08" },
  ]);

  const chartData = allCategories.map((category) => ({
    category,
    count: complaints.filter((c) => c.category === category).length,
  }));

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => router.back()} // <- go back to previous page
        className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">User Complaints Overview</h1>

      {/* Visualization */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-2xl font-semibold mb-4">Complaint Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Complaint Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Registered Complaints</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Category</th>
              <th className="p-3">Message</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{c.category}</td>
                <td className="p-3">{c.message}</td>
                <td className="p-3">{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
