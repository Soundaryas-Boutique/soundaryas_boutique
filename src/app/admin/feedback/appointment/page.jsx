

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { ChevronLeft, Calendar, Bell, CheckCircle, Users, Clock, ShoppingBag } from "lucide-react";

// --- MOCK DATA: Simulating appointment data from your form ---
// Dates are set relative to today (October 8, 2025) for a relevant chart.
const mockAppointments = [
  { id: 1, fullName: "Priya Sharma", email: "priya@example.com", appointmentType: "Special Occasion Styling", preferredDate: "2025-10-08", timeSlot: "Afternoon (2pm-5pm)", status: "Confirmed" },
  { id: 2, fullName: "Rohan Verma", email: "rohan@example.com", appointmentType: "Wardrobe Refresh", preferredDate: "2025-10-08", timeSlot: "Morning (10am-1pm)", status: "Pending" },
  { id: 3, fullName: "Anjali Mehta", email: "anjali@example.com", appointmentType: "Bridal Consultation", preferredDate: "2025-10-09", timeSlot: "Afternoon (2pm-5pm)", status: "Confirmed" },
  { id: 4, fullName: "Sameer Desai", email: "sam@example.com", appointmentType: "Custom Tailoring", preferredDate: "2025-10-07", timeSlot: "Evening (5pm-7pm)", status: "Confirmed" },
  { id: 5, fullName: "Neha Kapoor", email: "neha@example.com", appointmentType: "Special Occasion Styling", preferredDate: "2025-10-06", timeSlot: "Afternoon (2pm-5pm)", status: "Confirmed" },
  { id: 6, fullName: "Amit Patel", email: "amit@example.com", appointmentType: "Bridal Consultation", preferredDate: "2025-10-10", timeSlot: "Morning (10am-1pm)", status: "Pending" },
  { id: 7, fullName: "Kavita Singh", email: "kavita@example.com", appointmentType: "Wardrobe Refresh", preferredDate: "2025-10-05", timeSlot: "Morning (10am-1pm)", status: "Confirmed" },
  { id: 8, fullName: "Vikram Rathod", email: "vikram@example.com", appointmentType: "Special Occasion Styling", preferredDate: "2025-10-08", timeSlot: "Evening (5pm-7pm)", status: "Confirmed" },
];
// --- END OF MOCK DATA ---


export default function AppointmentsAnalyticsDashboard() {
  const router = useRouter();

  // --- 1. Process Data for Visualizations ---

  // --- KPI Card Data ---
  const totalAppointments = mockAppointments.length;
  const pendingCount = mockAppointments.filter(a => a.status === 'Pending').length;
  const today = new Date("2025-10-08T00:00:00.000Z"); // Setting a fixed "today" for consistent demo
  today.setHours(0, 0, 0, 0);
  const confirmedTodayCount = mockAppointments.filter(a => {
      const appDate = new Date(a.preferredDate);
      appDate.setHours(0,0,0,0);
      return a.status === 'Confirmed' && appDate.getTime() === today.getTime();
  }).length;

  // --- Chart Data ---
  // Bar Chart: Appointments in the last 7 days
  const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateString = d.toISOString().split('T')[0];
    const count = mockAppointments.filter(a => a.preferredDate === dateString).length;
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      Appointments: count,
    };
  }).reverse();

  // Pie Chart: Appointment Type Distribution
  const typeCounts = mockAppointments.reduce((acc, app) => {
    acc[app.appointmentType] = (acc[app.appointmentType] || 0) + 1;
    return acc;
  }, {});
  const typeDistributionData = Object.keys(typeCounts).map(key => ({
    name: key,
    value: typeCounts[key],
  }));

  // Bar Chart: Popular Time Slots
  const timeSlotCounts = mockAppointments.reduce((acc, app) => {
    const slot = app.timeSlot.split(' ')[0]; // 'Morning', 'Afternoon', 'Evening'
    acc[slot] = (acc[slot] || 0) + 1;
    return acc;
  }, {});
  const popularSlotsData = Object.keys(timeSlotCounts).map(key => ({
    name: key,
    Requests: timeSlotCounts[key],
  }));

  // Table Data: Upcoming Confirmed Appointments
  const upcomingAppointments = mockAppointments
    .filter(a => a.status === 'Confirmed' && new Date(a.preferredDate) >= today)
    .sort((a, b) => new Date(a.preferredDate) - new Date(b.preferredDate));
  
  const COLORS = ["#B22222", "#82ca9d", "#ffc658", "#8884d8"];

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => router.back()} className="mb-6 px-4 py-2 bg-white text-gray-700 rounded-lg font-semibold text-sm hover:bg-slate-200 transition flex items-center gap-2 shadow-sm border">
          <ChevronLeft size={18} /> Back
        </button>

        <h1 className="text-3xl font-bold mb-2 text-gray-800">Appointments Analytics</h1>
        <p className="text-gray-500 mb-8">An overview of booking trends and client requests.</p>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-5">
            <div className="bg-blue-100 p-4 rounded-full"><Users className="text-blue-600" size={28}/></div>
            <div><p className="text-sm text-gray-500">Total Bookings</p><p className="text-3xl font-bold text-gray-800">{totalAppointments}</p></div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-5">
            <div className="bg-yellow-100 p-4 rounded-full"><Bell className="text-yellow-500" size={28}/></div>
            <div><p className="text-sm text-gray-500">Pending Requests</p><p className="text-3xl font-bold text-gray-800">{pendingCount}</p></div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-5">
            <div className="bg-green-100 p-4 rounded-full"><CheckCircle className="text-green-600" size={28}/></div>
            <div><p className="text-sm text-gray-500">Confirmed Today</p><p className="text-3xl font-bold text-gray-800">{confirmedTodayCount}</p></div>
          </div>
        </div>

        {/* Main Chart: Weekly Trend */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Appointments This Week</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last7DaysData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Appointments" fill="#B22222" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Service Popularity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={typeDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} fill="#8884d8" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {typeDistributionData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Popular Time Slots</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={popularSlotsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip />
                    <Bar dataKey="Requests" fill="#82ca9d" radius={[0, 4, 4, 0]}/>
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Appointments Table */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Upcoming Confirmed Appointments</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-sm font-semibold text-gray-600">Date & Time</th>
                  <th className="p-3 text-sm font-semibold text-gray-600">Client</th>
                  <th className="p-3 text-sm font-semibold text-gray-600">Service</th>
                  <th className="p-3 text-sm font-semibold text-gray-600">Contact</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.map((app) => (
                  <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="p-3 font-medium text-gray-800">
                      {new Date(app.preferredDate).toLocaleDateString("en-GB", { month: 'short', day: 'numeric' })}
                      <span className="block text-xs text-gray-500">{app.timeSlot}</span>
                    </td>
                    <td className="p-3 text-gray-800">{app.fullName}</td>
                    <td className="p-3 text-gray-600">{app.appointmentType}</td>
                    <td className="p-3 text-blue-600 text-sm hover:underline">
                      <a href={`mailto:${app.email}`}>{app.email}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}