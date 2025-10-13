"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronLeft, ClipboardList, Scissors, Shirt, Wrench, Search, X, User, Mail, Ruler } from 'lucide-react';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Alterations', 'Ready'];

// --- Helper: Modal to view full measurement details (Unchanged) ---
function MeasurementDetailsModal({ isOpen, onClose, order }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X size={24} /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Measurements for {order.orderId || order._id}</h2>
        <p className="text-sm text-gray-500 mb-6">Submitted by <span className="font-semibold">{order.name}</span> for a <span className="font-semibold">{order.garmentType}</span>.</p>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                {Object.entries(order.measurements).map(([key, value]) => (
                    <div key={key} className="bg-slate-100 p-3 rounded-lg border">
                        <p className="text-sm capitalize text-gray-500">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="text-xl font-bold text-[#B22222]">{value} <span className="text-sm font-normal text-gray-600">{order.unit}</span></p>
                    </div>
                ))}
            </div>
            {order.specialInstructions && (
                <div>
                    <h3 className="font-semibold text-gray-700 mt-4">Special Instructions:</h3>
                    <p className="text-gray-600 bg-slate-50 border p-3 rounded-lg mt-1 italic">"{order.specialInstructions}"</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}


export default function AdminTailoringDashboard() {
  const router = useRouter();
  // --- CHANGE: State now manages live data and loading status ---
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingOrder, setViewingOrder] = useState(null);

  // --- CHANGE: Fetch all tailoring orders from the backend ---
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
        const res = await fetch('/api/tailoring-orders'); // This now fetches ALL orders
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.orders || []);
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- CHANGE: handleStatusChange now calls the backend API ---
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/tailoring-orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const { order: updatedOrder } = await res.json();
      // Update the state locally to reflect the change instantly
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? updatedOrder : order
        )
      );
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const filteredOrders = orders.filter(order =>
    (activeFilter === 'All' || order.status === activeFilter) &&
    (order.name.toLowerCase().includes(searchTerm.toLowerCase()) || (order.orderId && order.orderId.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading Tailoring Orders...</div>
  }

  return (
    <>
      <main className="min-h-screen bg-slate-100 font-sans p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => router.back()} className="mb-6 px-4 py-2 bg-white text-gray-700 rounded-lg font-semibold text-sm hover:bg-slate-200 transition flex items-center gap-2 shadow-sm border">
            <ChevronLeft size={18} /> Back
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Custom Tailoring Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage and track all custom garment orders.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-5 rounded-xl shadow-sm"><p className="text-sm text-gray-500">Total Orders</p><p className="text-2xl font-bold text-gray-800">{orders.length}</p></div>
              <div className="bg-white p-5 rounded-xl shadow-sm"><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold text-yellow-600">{statusCounts['Pending'] || 0}</p></div>
              <div className="bg-white p-5 rounded-xl shadow-sm"><p className="text-sm text-gray-500">In Progress</p><p className="text-2xl font-bold text-blue-600">{statusCounts['In Progress'] || 0}</p></div>
              <div className="bg-white p-5 rounded-xl shadow-sm"><p className="text-sm text-gray-500">Ready for Pickup</p><p className="text-2xl font-bold text-green-600">{statusCounts['Ready'] || 0}</p></div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => setActiveFilter('All')} className={`filter-btn ${activeFilter === 'All' ? 'filter-btn-active' : ''}`}>All</button>
                {STATUS_OPTIONS.map(status => (
                    <button key={status} onClick={() => setActiveFilter(status)} className={`filter-btn ${activeFilter === status ? 'filter-btn-active' : ''}`}>{status}</button>
                ))}
              </div>
               <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Search by name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
              </div>
            </div>

            <div className="space-y-6">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <div key={order._id} className="border border-slate-200 rounded-lg p-5">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div><p className="font-mono text-sm font-semibold text-[#B22222]">{order.orderId || order._id}</p><p className="text-lg font-bold text-gray-800">{order.garmentType}</p></div>
                        <div><p className="text-sm font-semibold text-gray-700">{order.name}</p><p className="text-xs text-gray-500">{order.email}</p></div>
                        <div>
                            <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} className="w-full p-2 text-sm font-semibold border rounded-md">
                                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="flex justify-start md:justify-end">
                            <button onClick={() => setViewingOrder(order)} className="flex items-center gap-2 text-sm bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 font-semibold">
                                <Ruler size={16}/> View Measurements
                            </button>
                        </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-12">No tailoring orders found for this filter.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <MeasurementDetailsModal isOpen={!!viewingOrder} onClose={() => setViewingOrder(null)} order={viewingOrder} />
      
      <style jsx>{`
        .filter-btn { padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 600; border-radius: 0.5rem; transition: all 0.2s; background-color: #f1f5f9; color: #475569; }
        .filter-btn:hover { background-color: #e2e8f0; }
        .filter-btn-active { background-color: #B22222; color: #ffffff; }
      `}</style>
    </>
  );
}