"use client";
import React from "react";
import OrderDetails from "../../../../components/OrderDetails";
import ProfileNav from "../../../../components/ProfileNav";

export default function OrdersPage() {
  return (
    <div className="flex flex-col md:flex-row p-4">
      <ProfileNav />
      <div className="ml-9">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        <OrderDetails />
      </div>
    </div>
  );
}