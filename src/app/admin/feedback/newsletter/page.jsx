"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function NewsletterPage() {
  const router = useRouter();

  const [subscribers] = useState([
    { id: 1, name: "Alice", gender: "Female", subscription: "Weekly", offers: true },
    { id: 2, name: "Bob", gender: "Male", subscription: "Monthly", offers: false },
    { id: 3, name: "Charlie", gender: "Other", subscription: "Weekly", offers: true },
    { id: 4, name: "Diana", gender: "Female", subscription: "Monthly", offers: true },
    { id: 5, name: "Ethan", gender: "Male", subscription: "Weekly", offers: false },
  ]);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  const genderData = [
    { name: "Male", value: subscribers.filter(s => s.gender === "Male").length },
    { name: "Female", value: subscribers.filter(s => s.gender === "Female").length },
    { name: "Other", value: subscribers.filter(s => s.gender === "Other").length },
  ];

  const subscriptionData = [
    { name: "Weekly", value: subscribers.filter(s => s.subscription === "Weekly").length },
    { name: "Monthly", value: subscribers.filter(s => s.subscription === "Monthly").length },
  ];

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold text-lg hover:bg-gray-700 transition flex items-center gap-2"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-8 text-gray-800">Newsletter Subscribers Overview</h1>

      {/* Side-by-side charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Gender Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Subscribers by Gender</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
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
              <Pie
                data={subscriptionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#82ca9d"
                label
              >
                {subscriptionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subscriber Table */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Registered Subscribers</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3">Name</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Subscription</th>
                <th className="p-3">Offers</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.gender}</td>
                  <td className="p-3">{s.subscription}</td>
                  <td className="p-3">{s.offers ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
