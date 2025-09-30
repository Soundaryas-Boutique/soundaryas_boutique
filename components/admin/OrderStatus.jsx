"use client";
import React, { useState } from 'react';

const statusOptions = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled"
];

export default function OrderStatus({ orderId, currentStatus, onStatusUpdate }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status.');
      }
      
      setStatus(newStatus);
      onStatusUpdate(orderId, newStatus); // Notify the parent component to refresh
    } catch (err) {
      alert(`Error updating order status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      onChange={handleStatusChange}
      disabled={loading}
      className={`border p-1 rounded-md text-sm font-medium ${
        status === 'delivered' ? 'bg-green-100 border-green-500' : 
        status === 'shipped' ? 'bg-blue-100 border-blue-500' :
        status === 'cancelled' ? 'bg-red-100 border-red-500' :
        'bg-gray-100 border-gray-300'
      }`}
    >
      {loading ? (
        <option>Updating...</option>
      ) : (
        statusOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))
      )}
    </select>
  );
}