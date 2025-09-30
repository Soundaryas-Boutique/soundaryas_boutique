"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import OrderStatus from './OrderStatus'; // Import the new component
import { Trash2 } from 'lucide-react';

export default function OrdersDashboard() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    if (status !== 'authenticated' || session.user.role !== 'Admin') {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/admin/orders');
      if (!res.ok) {
        throw new Error('Failed to fetch orders from admin API.');
      }
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [session, status]);

  const handleOrderDelete = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order? This cannot be undone.')) return;

    try {
      const res = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete order.');
      }
      
      // Update the local state to remove the deleted order
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (err) {
      alert(`Error deleting order: ${err.message}`);
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    // Optionally update local state if the OrderStatus component doesn't handle the full set
    console.log(`Order ${orderId} updated to ${newStatus}`);
    // Re-fetch data for simplicity if necessary, but component state handles it
  };


  if (loading) return <div className="p-10 text-center">Loading all orders...</div>;
  if (error) return <div className="p-10 text-center text-red-600">Error loading orders: {error}</div>;
  if (status !== 'authenticated' || session.user.role !== 'Admin') {
    return <div className="p-10 text-center text-red-600">ACCESS DENIED. Only Admin can view this page.</div>;
  }
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Customer Orders</h1>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items (Qty)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr><td colSpan="6" className="py-4 text-center text-gray-500">No orders found yet.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order._id.substring(0, 8)}...
                    <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.userId?.name || 'User Deleted'}</div>
                    <div className="text-sm text-gray-500">{order.userId?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.products.map(p => 
                      <div key={p._id}>- {p.productName} (x{p.quantity})</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-900">
                    ₹{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OrderStatus 
                      orderId={order._id}
                      currentStatus={order.orderStatus}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOrderDelete(order._id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
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