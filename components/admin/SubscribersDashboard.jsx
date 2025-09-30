"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function SubscribersDashboard() {
  const { data: session, status } = useSession();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubscribers = async () => {
    if (status !== 'authenticated' || session.user.role !== 'Admin') {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/admin/subscribers');
      if (!res.ok) {
        throw new Error('Failed to fetch subscribers from admin API.');
      }
      const data = await res.json();
      setSubscribers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [session, status]);

  if (loading) return <div className="p-10 text-center">Loading all subscribers...</div>;
  if (error) return <div className="p-10 text-center text-red-600">Error loading subscribers: {error}</div>;
  if (status !== 'authenticated' || session.user.role !== 'Admin') {
    return <div className="p-10 text-center text-red-600">ACCESS DENIED. Only Admin can view this page.</div>;
  }
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Newsletter Subscribers</h1>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscribed At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subscribers.length === 0 ? (
              <tr><td colSpan="4" className="py-4 text-center text-gray-500">No subscribers found yet.</td></tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.phone || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}