"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react';
// We assume recharts is available in the environment as per instructions
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Mail, Users, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react'; // Using lucide-react for icons

// ----------------------------------------------------------------------
// NOTE: Mocking external dependencies for standalone execution
// In a real Next.js environment, you would use the actual imports.

// Fix: Define the mock session object as a constant so the hook returns a stable reference.
const MOCK_SESSION_DATA = {
  data: { user: { role: 'Admin' } },
  status: 'authenticated',
};

// Mock the external dependencies (next-auth/react and API fetch)
const useSession = () => MOCK_SESSION_DATA;

// Mock subscriber data with mock 'createdAt' dates for monthly grouping (up to October 2024)
const mockSubscribers = [
  // Older data for context
  { _id: 's1', email: 'john@example.com', name: 'John Doe', phone: '123-456-7890', createdAt: '2024-07-15T10:00:00Z' },
  { _id: 's2', email: 'jane@example.com', name: 'Jane Smith', phone: '987-654-3210', createdAt: '2024-07-20T10:00:00Z' },
  { _id: 's3', email: 'alice@example.com', name: 'Alice', phone: null, createdAt: '2024-08-01T10:00:00Z' },
  { _id: 's4', email: 'bob@example.com', name: 'Bob', phone: '555-123-4567', createdAt: '2024-08-05T10:00:00Z' },
  { _id: 's5', email: 'charlie@example.com', name: 'Charlie', phone: null, createdAt: '2024-09-10T10:00:00Z' },
  { _id: 's6', email: 'david@example.com', name: 'David', phone: '111-222-3333', createdAt: '2024-09-25T10:00:00Z' },
  { _id: 's7', email: 'eve@example.com', name: 'Eve', phone: null, createdAt: '2024-09-28T10:00:00Z' },
  // October data (as requested by user)
  { _id: 's8', email: 'frank@example.com', name: 'Frank', phone: '444-555-6666', createdAt: '2024-10-01T10:00:00Z' },
  { _id: 's9', email: 'grace@example.com', name: 'Grace', phone: null, createdAt: '2024-10-05T10:00:00Z' },
  { _id: 's10', email: 'heidi@example.com', name: 'Heidi', phone: '777-888-9999', createdAt: '2024-10-10T10:00:00Z' },
  { _id: 's11', email: 'ivan@example.com', name: 'Ivan', phone: null, createdAt: '2024-10-15T10:00:00Z' },
  { _id: 's12', email: 'judy@example.com', name: 'Judy', phone: '222-333-4444', createdAt: '2024-10-20T10:00:00Z' },
  { _id: 's13', email: 'kevin@example.com', name: 'Kevin', phone: null, createdAt: '2024-10-25T10:00:00Z' },
  { _id: 's14', email: 'lisa@example.com', name: 'Lisa', phone: '999-000-1111', createdAt: '2024-10-30T10:00:00Z' },
];

// Helper to format date keys (YYYY-MM)
const formatDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

// Helper to format month name for display
const formatMonthName = (dateKey) => {
  const [year, month] = dateKey.split('-');
  const d = new Date(year, parseInt(month) - 1);
  return d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
};

// ----------------------------------------------------------------------

export default function SubscribersDashboard() {
  // Using the mock session
  const { data: session, status } = useSession(); 
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // MOCK: Replace fetchSubscribers with a mock implementation
  const fetchSubscribers = useCallback(async () => {
    // Simulate auth check based on the mock session
    if (status !== 'authenticated' || session.user.role !== 'Admin') {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      // Simulate API fetch delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // Load mock data
      setSubscribers(mockSubscribers);
    } catch (err) {
      setError('An error occurred while loading mock data.');
    } finally {
      setLoading(false);
    }
  }, [session, status]);


  useEffect(() => {
    // Only run if status changes or on initial load
    if (status === 'authenticated') {
      // Since fetchSubscribers is stable now, this effect only runs once
      // (or when status changes in a real app).
      fetchSubscribers();
    }
  }, [status, fetchSubscribers]);


  // Data processing for Visualization: Grouping subscribers by month
  const chartData = useMemo(() => {
    const counts = subscribers.reduce((acc, sub) => {
      // Get YYYY-MM key from createdAt date
      const key = formatDateKey(sub.createdAt);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    // Convert map to array and sort by date key
    return Object.entries(counts)
      .map(([dateKey, count]) => ({
        dateKey,
        month: formatMonthName(dateKey),
        subscribers: count,
      }))
      .sort((a, b) => (a.dateKey > b.dateKey ? 1 : -1));
  }, [subscribers]);


  // --- Render Logic ---
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-2" />
      <div className="text-lg font-medium text-indigo-700">Loading dashboard data...</div>
    </div>
  );

  if (error) return (
    <div className="p-10 text-center bg-red-50 border border-red-300 rounded-lg m-4 shadow-md">
      <AlertTriangle className="w-6 h-6 text-red-600 inline-block mr-2" />
      <span className="font-semibold text-red-700">Error loading subscribers:</span> {error}
    </div>
  );

  if (status !== 'authenticated' || session.user.role !== 'Admin') {
    return (
      <div className="p-10 text-center bg-yellow-50 border border-yellow-300 rounded-lg m-4 shadow-md">
        <AlertTriangle className="w-6 h-6 text-yellow-600 inline-block mr-2" />
        <span className="font-semibold text-yellow-700">ACCESS DENIED.</span> Only Admin can view this page.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 bg-gray-50 min-h-screen font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-800 border-b-4 border-indigo-200 pb-2 flex items-center">
          <Mail className="w-8 h-8 mr-3 text-indigo-500" />
          Newsletter Subscribers Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Administrative overview of subscription growth and details.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 hover:shadow-xl transition-shadow duration-300">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Subscribers</p>
          <p className="text-4xl font-bold text-gray-900 mt-1">{subscribers.length}</p>
          <Users className="w-6 h-6 text-indigo-400 mt-2" />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-teal-500 hover:shadow-xl transition-shadow duration-300">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Latest Month</p>
          <p className="text-4xl font-bold text-gray-900 mt-1">
            {/* Show the last month in the chart data */}
            {chartData.length > 0 ? chartData[chartData.length - 1].month : 'N/A'}
          </p>
          <TrendingUp className="w-6 h-6 text-teal-400 mt-2" />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-300">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Subscribers This Month</p>
          <p className="text-4xl font-bold text-gray-900 mt-1">
            {/* Show the count for the last month */}
            {chartData.length > 0 ? chartData[chartData.length - 1].subscribers : 0}
          </p>
          <TrendingUp className="w-6 h-6 text-purple-400 mt-2" />
        </div>
      </div>

      {/* 2. VISUALIZATION SECTION */}
      <section className="mb-10 p-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
          Monthly Subscription Growth
        </h2>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" stroke="#333" />
              <YAxis allowDecimals={false} stroke="#333" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '10px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
                formatter={(value) => [value, 'New Subscribers']}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="subscribers" name="New Subscribers" fill="#4f46e5" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          Visualization is based on the subscriber sign-up dates.
        </p>
      </section>

      {/* 3. SUBSCRIBER TABLE */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Subscriber Details</h2>
        <div className="overflow-x-auto bg-white rounded-xl shadow-2xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider rounded-tl-xl">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider rounded-tr-xl">Subscribed At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {subscribers.length === 0 ? (
                <tr><td colSpan="4" className="py-8 text-center text-lg text-gray-500">No subscribers found yet.</td></tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub._id} className="hover:bg-indigo-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-700">{sub.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sub.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sub.phone || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(sub.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
