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

export default function ComplaintPage() {
  const [complaints, setComplaints] = useState([
    { id: 1, category: "Delivery Delay", message: "Order came late", date: "2025-10-05" },
    { id: 2, category: "Product Quality", message: "Fabric was different than shown", date: "2025-10-06" },
  ]);
  const [newComplaint, setNewComplaint] = useState({ category: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComplaint.category || !newComplaint.message) return;

    const complaint = {
      id: complaints.length + 1,
      ...newComplaint,
      date: new Date().toISOString().split("T")[0],
    };

    setComplaints([...complaints, complaint]);
    setNewComplaint({ category: "", message: "" });
  };

  const chartData = Object.values(
    complaints.reduce((acc, curr) => {
      acc[curr.category] = acc[curr.category] || { category: curr.category, count: 0 };
      acc[curr.category].count += 1;
      return acc;
    }, {})
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Complaint Registration</h1>

      {/* Complaint Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-10 space-y-4 max-w-xl"
      >
        <div>
          <label className="block font-semibold mb-1">Complaint Category</label>
          <select
            value={newComplaint.category}
            onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select category</option>
            <option value="Delivery Delay">Delivery Delay</option>
            <option value="Product Quality">Product Quality</option>
            <option value="Payment Issue">Payment Issue</option>
            <option value="Customer Service">Customer Service</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Complaint Details</label>
          <textarea
            value={newComplaint.message}
            onChange={(e) => setNewComplaint({ ...newComplaint, message: e.target.value })}
            placeholder="Describe your issue..."
            className="w-full border rounded-md px-3 py-2 h-24"
          />
        </div>

        <button
          type="submit"
          className="bg-gray-900 text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-700 transition"
        >
          Submit Complaint
        </button>
      </form>

      {/* Visualization */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-2xl font-semibold mb-4">Complaint Overview</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-10">No complaints yet.</p>
        )}
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
