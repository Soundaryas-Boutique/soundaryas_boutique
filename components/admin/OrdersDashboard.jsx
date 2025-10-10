"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import OrderStatus from './OrderStatus';
import { Trash2, FiEye } from 'lucide-react';
import CustomerDetailsModal from './CustomerDetailsModal';

const PIE_CHART_COLORS = ['#8B0000', '#FFBB28', '#00C49F', '#0088FE'];

export default function OrdersDashboard() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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

  // ✅ Memoize the processed data for charts
  const { topProductsData, orderStatusData } = useMemo(() => {
    const productCounts = {};
    const statusCounts = { processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
    
    orders.forEach(order => {
      // Process for order status visualization
      if (statusCounts[order.orderStatus] !== undefined) {
        statusCounts[order.orderStatus]++;
      }

      // Process for top selling products visualization
      order.products.forEach(product => {
        const name = product.productName;
        if (productCounts[name]) {
          productCounts[name] += product.quantity;
        } else {
          productCounts[name] = product.quantity;
        }
      });
    });

    // Convert status counts to an array for the PieChart
    const statusChartData = Object.keys(statusCounts).map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusCounts[status],
    }));

    // Sort products to find the top 3 and format for the BarChart
    const sortedProducts = Object.entries(productCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, quantity]) => ({ name, quantity }));

    return { topProductsData: sortedProducts, orderStatusData: statusChartData };
  }, [orders]);


  const handleOrderDelete = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order? This cannot be undone.')) return;

    try {
      const res = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete order.');
      }
      
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (err) {
      alert(`Error deleting order: ${err.message}`);
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    console.log(`Order ${orderId} updated to ${newStatus}`);
  };

  const openCustomerModal = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const closeCustomerModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };


  if (loading) return <div className="p-10 text-center">Loading all orders...</div>;
  if (error) return <div className="p-10 text-center text-red-600">Error loading orders: {error}</div>;
  if (status !== 'authenticated' || session.user.role !== 'Admin') {
    return <div className="p-10 text-center text-red-600">ACCESS DENIED. Only Admin can view this page.</div>;
  }
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Customer Orders</h1>
      
      {/* ✅ Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Top 3 Selling Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#8B0000" />
              <YAxis stroke="#8B0000" />
              <Tooltip />
              <Bar dataKey="quantity" fill="#FFD700" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Order Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={orderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

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
                    <button 
                      onClick={() => openCustomerModal(order.userId)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-900 hover:underline"
                    >
                      {order.userId?.name || 'User Deleted'}
                    </button>
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
      
      {isModalOpen && selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onClose={closeCustomerModal}
        />
      )}
    </div>
  );
}