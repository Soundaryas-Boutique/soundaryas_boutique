"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function NewsletterPage() {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  useEffect(() => {
    async function fetchSubscribers() {
      try {
        const res = await fetch("/api/subscribe");
        const data = await res.json();
        setSubscribers(data.subscribers || []);
      } catch (error) {
        console.error("❌ Error fetching subscribers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSubscribers();
  }, []);

  const downloadCSV = () => {
    if (!subscribers.length) return;

    const headers = ["Email", "Gender", "Subscription", "Exclusive Offer"];
    const rows = subscribers.map(s => [
      s.email,
      s.gender,
      s.subscriptionType,
      s.exclusiveOffer ? "Yes" : "No",
    ]);

    const csvContent =
      [headers, ...rows].map(e => e.map(v => `"${v}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p className="p-6">Loading subscribers...</p>;
  if (!subscribers.length) return <p className="p-6">No subscribers found.</p>;

  const genderData = [
    { name: "Male", value: subscribers.filter(s => s.gender === "Male").length },
    { name: "Female", value: subscribers.filter(s => s.gender === "Female").length },
    { name: "Other", value: subscribers.filter(s => s.gender === "Other").length },
  ];

  const subscriptionData = [
    { name: "Weekly", value: subscribers.filter(s => s.subscriptionType === "Weekly").length },
    { name: "Monthly", value: subscribers.filter(s => s.subscriptionType === "Monthly").length },
    { name: "Yearly", value: subscribers.filter(s => s.subscriptionType === "Yearly").length },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => router.back()} className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 transition">
          ← Back
        </button>

        <button onClick={downloadCSV} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          Download CSV
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-gray-800">Newsletter Subscribers Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Gender Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Subscribers by Gender</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {genderData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Subscription Donut Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Subscribers by Subscription Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={subscriptionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} label>
                {subscriptionData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Registered Subscribers</h2>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Email</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Subscription</th>
              <th className="p-3">Offers</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map(s => (
              <tr key={s._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.gender}</td>
                <td className="p-3">{s.subscriptionType}</td>
                <td className="p-3">{s.exclusiveOffer ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
