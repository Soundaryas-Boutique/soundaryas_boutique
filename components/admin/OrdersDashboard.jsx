"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import OrderStatus from './OrderStatus';
import { Trash2, Download } from 'lucide-react'; // Added Download icon
import CustomerDetailsModal from './CustomerDetailsModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CSVLink } from 'react-csv';

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

  const { topProductsData, orderStatusData } = useMemo(() => {
    const productCounts = {};
    const statusCounts = { processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
    
    orders.forEach(order => {
      if (statusCounts[order.orderStatus] !== undefined) {
        statusCounts[order.orderStatus]++;
      }
      order.products.forEach(product => {
        const name = product.productName;
        if (productCounts[name]) {
          productCounts[name] += product.quantity;
        } else {
          productCounts[name] = product.quantity;
        }
      });
    });

    const statusChartData = Object.keys(statusCounts).map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusCounts[status],
    }));

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

  // ✅ New function to handle PDF download
  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.text('Customer Orders Dashboard Report', 14, 20);

    // Prepare data for the autoTable plugin
    const tableColumn = ["Order ID", "Customer Name", "Customer Email", "Items (Qty)", "Total", "Status", "Date"];
    const tableRows = orders.map(order => [
      order._id.substring(0, 8) + '...',
      order.userId?.name || 'User Deleted',
      order.userId?.email || 'N/A',
      order.products.map(p => `${p.productName} (x${p.quantity})`).join(', '),
      `₹${order.totalAmount.toFixed(2)}`,
      order.orderStatus,
      new Date(order.createdAt).toLocaleDateString()
    ]);

    // Use jspdf-autotable to generate the table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    // Save the PDF
    doc.save('orders-report.pdf');
  };

  // ✅ New function to prepare data for CSV download
  const getCsvData = () => {
    const csvHeaders = ["Order ID", "Customer Name", "Customer Email", "Items (Qty)", "Total", "Status", "Date"];
    const csvRows = orders.map(order => ({
      "Order ID": order._id,
      "Customer Name": order.userId?.name || 'User Deleted',
      "Customer Email": order.userId?.email || 'N/A',
      "Items (Qty)": order.products.map(p => `${p.productName} (x${p.quantity})`).join(', '),
      "Total": `₹${order.totalAmount.toFixed(2)}`,
      "Status": order.orderStatus,
      "Date": new Date(order.createdAt).toLocaleDateString()
    }));
    return csvRows;
  };

  if (loading) return <div className="p-10 text-center">Loading all orders...</div>;
  if (error) return <div className="p-10 text-center text-red-600">Error loading orders: {error}</div>;
  if (status !== 'authenticated' || session.user.role !== 'Admin') {
    return <div className="p-10 text-center text-red-600">ACCESS DENIED. Only Admin can view this page.</div>;
  }
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Customer Orders</h1>
      
      {/* ✅ Download Buttons */}
      <div className="flex justify-end gap-4 mb-6">
        <button
          onClick={handleDownloadPdf}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          title="Download as PDF"
        >
          <Download size={16} /> Download PDF
        </button>
        <CSVLink
          data={getCsvData()}
          filename={"orders-report.csv"}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          target="_blank"
        >
          <Download size={16} /> Download CSV
        </CSVLink>
      </div>

      {/* Visualizations Section */}
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