"use client";
import React, { useState, useEffect } from "react";
import OrderDetails from "../../../../components/OrderDetails"; // Correct path to the client component
import ProfileNav from "../../../../components/ProfileNav"; // Correct path to ProfileNav

export default function OrdersPage() {
  return (
    <div className="flex flex-col md:flex-row p-4">
      {/*Left side*/}
      <ProfileNav />

      {/*Right side*/}
      <div className="ml-9">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        <OrderDetails />
      </div>
    </div>
  );
}