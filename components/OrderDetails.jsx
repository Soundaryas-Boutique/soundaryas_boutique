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
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center">Loading your orders...</p>;
  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;
  if (orders.length === 0) {
    return (
      <div className="text-center">
        <p className="text-gray-600">You have no past orders.</p>
        <Link href="/collections" className="text-blue-500 hover:underline">
          Start shopping now!
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
      {orders.map((order) => (
        <div key={order._id} className="border p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Order ID: {order._id.substring(0, 8)}</h3>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                order.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Date: {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <ul className="list-disc list-inside space-y-1">
            {order.products.map((product, index) => (
              <li key={index}>
                {product.productName} ({product.quantity}) - ₹{product.price}
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t pt-2">
            <p className="font-bold text-lg">Total: ₹{order.totalAmount}</p>
            <p className="text-sm">Status: {order.orderStatus}</p>
          </div>
        </div>
      ))}
    </div>
  );
}