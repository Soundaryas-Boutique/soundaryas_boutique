"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";


export default function ComplaintPage() {
  const router = useRouter();

  const allCategories = [
    "Delivery Delay",
    "Product Quality",
    "Payment Issue",
    "Customer Service",
    "Others",
  ];

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const res = await fetch("/api/complaint");
        const data = await res.json();
        setComplaints(data.complaints || []);
      } catch (error) {
        console.error("❌ Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchComplaints();
  }, []);

  const chartData = allCategories.map((category) => ({
    category,
    count: complaints.filter((c) => c.complaintType === category).length,
  }));

  if (loading) return <p className="p-6">Loading complaints...</p>;

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">User Complaints Overview</h1>

      {/* Bar Chart */}
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
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4">Registered Complaints</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Order ID</th>
              <th className="p-3">Category</th>
              <th className="p-3">Message</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.phone || "-"}</td>
                <td className="p-3">{c.orderId || "-"}</td>
                <td className="p-3">{c.complaintType}</td>
                <td className="p-3">{c.complaint}</td>
                <td className="p-3">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
