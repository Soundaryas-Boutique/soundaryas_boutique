"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { ChevronLeft, Bell, CheckCircle, Users } from "lucide-react";

export default function AppointmentsAnalyticsDashboard() {
  const router = useRouter();
  
  // --- CHANGE: State for fetching and loading live data ---
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- CHANGE: useEffect to fetch data from the API ---
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch('/api/appointments');
        if (!res.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await res.json();
        setAppointments(data.appointments || []);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // --- Data processing now uses the live 'appointments' state ---

  // KPI Card Data
  const totalAppointments = appointments.length;
  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const today = new Date(); // Use the actual current date
  today.setHours(0, 0, 0, 0);
  const confirmedTodayCount = appointments.filter(a => {
      const appDate = new Date(a.preferredDate);
      appDate.setHours(0,0,0,0);
      return a.status === 'Confirmed' && appDate.getTime() === today.getTime();
  }).length;

  // Chart Data
  const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateString = d.toISOString().split('T')[0];
    const count = appointments.filter(a => a.preferredDate.startsWith(dateString)).length;
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      Appointments: count,
    };
  }).reverse();

  const typeCounts = appointments.reduce((acc, app) => {
    acc[app.appointmentType] = (acc[app.appointmentType] || 0) + 1;
    return acc;
  }, {});
  const typeDistributionData = Object.keys(typeCounts).map(key => ({
    name: key,
    value: typeCounts[key],
  }));

  const timeSlotCounts = appointments.reduce((acc, app) => {
    const slot = app.timeSlot.split(' ')[0];
    acc[slot] = (acc[slot] || 0) + 1;
    return acc;
  }, {});
  const popularSlotsData = Object.keys(timeSlotCounts).map(key => ({
    name: key,
    Requests: timeSlotCounts[key],
  }));

  const upcomingAppointments = appointments
    .filter(a => a.status === 'Confirmed' && new Date(a.preferredDate) >= today)
    .sort((a, b) => new Date(a.preferredDate) - new Date(b.preferredDate));
  
  const COLORS = ["#B22222", "#82ca9d", "#ffc658", "#8884d8"];

  // --- CHANGE: Render a loading state while fetching data ---
  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center text-gray-500">
            <p>Loading Analytics...</p>
        </div>
    );
  }

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
                {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((app) => (
                    <tr key={app._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
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
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="text-center py-10 text-gray-500">No upcoming confirmed appointments.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}