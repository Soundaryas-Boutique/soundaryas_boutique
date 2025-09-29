"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await res.json();
        console.log("Orders API response: ",data)
        // The data is already serialized by the API route
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "shipped": return "bg-blue-100 text-blue-800";
      case "processing": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <p className="text-center p-10">Loading your orders...</p>;
  if (error) return <p className="text-red-500 text-center p-10">Error: {error}</p>;
  
  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <div className="text-center border p-6 rounded-lg bg-white shadow-sm">
          <p className="text-gray-600 mb-4">You have no past orders.</p>
          <Link href="/collections" className="bg-[#B22222] text-white font-bold py-2 px-4 rounded-full transition-colors hover:bg-[#8B0000]">
            Start Shopping Now
          </Link>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-6 rounded-lg shadow-lg bg-white">
            <div className="flex justify-between items-start mb-3 border-b pb-2">
              <div>
                <h3 className="font-bold text-lg text-gray-800">Order #{order._id.substring(0, 8).toUpperCase()}</h3>
                <p className="text-sm text-gray-500">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>
            
            <p className="font-medium text-gray-700 mb-2">Items Ordered:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-gray-600">
              {order.products.map((product, index) => (
                <li key={index} className="flex justify-between">
                  <span>{product.productName} (x{product.quantity})</span>
                  <span className="font-semibold">₹{product.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t pt-3 flex justify-between items-center">
              <p className="font-bold text-xl text-[#B22222]">Total Paid:</p>
              <p className="font-bold text-xl text-[#B22222]">₹{order.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}