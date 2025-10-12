"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch("/api/orders");
          if (!res.ok) {
            throw new Error("Failed to fetch orders");
          }
          const data = await res.json();
          setOrders(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else if (session === null) {
        setLoading(false);
        setOrders([]);
      }
    };
    fetchOrders();
  }, [session]);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800 border-green-500";
      case "shipped": return "bg-blue-100 text-blue-800 border-blue-500";
      case "processing": return "bg-yellow-100 text-yellow-800 border-yellow-500";
      case "cancelled": return "bg-red-100 text-red-800 border-red-500";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getCardBgColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-50 border-green-200";
      case "shipped": return "bg-blue-50 border-blue-200";
      case "processing": return "bg-yellow-50 border-yellow-200";
      case "cancelled": return "bg-red-50 border-red-200";
      default: return "bg-white border-gray-200";
    }
  };

  if (loading) return <p className="text-center p-10 text-gray-600">Loading your orders...</p>;
  if (error) return <p className="text-red-500 text-center p-10">Error: {error}</p>;
  
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {orders.length === 0 ? (
        <div className="text-center border-2 border-dashed p-10 rounded-xl bg-white shadow-sm">
          <p className="text-gray-600 text-lg mb-4">You have no past orders.</p>
          <Link href="/collections" className="bg-[#B22222] text-white font-bold py-3 px-6 rounded-full transition-colors hover:bg-[#8B0000]">
            Start Shopping Now
          </Link>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className={`w-full p-8 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl ${getCardBgColor(order.orderStatus)}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b-2 border-gray-200 pb-4">
              <div>
                <h3 className="font-extrabold text-2xl text-gray-900 mb-1">
                  Order ID: <span className="font-normal text-lg">{order._id.substring(0, 8).toUpperCase()}...</span>
                </h3>
                <p className="text-sm text-gray-500">
                  Date Placed: {new Date(order.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <span className={`px-4 py-2 text-xs font-bold rounded-full uppercase mt-4 md:mt-0 ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-bold text-gray-800 mb-2">Items Ordered:</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {order.products.map((product, index) => (
                    <li key={index} className="flex justify-between items-center border-l-4 border-gray-300 pl-4 py-2 bg-white rounded-r-md shadow-sm">
                      <span className="font-semibold">{product.productName} (x{product.quantity})</span>
                      <span className="font-extrabold">₹{product.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
                <p className="font-bold text-gray-800 mb-2">Order Summary:</p>
                <div className="flex justify-between items-center text-sm text-gray-600 border-b pb-2 mb-2">
                  <span>Subtotal:</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold text-[#B22222] mt-4">
                  <span>Total Paid:</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}