"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUser, FiMail, FiPhone, FiPackage, FiShoppingBag, FiTruck, FiMapPin } from "react-icons/fi";

// Personal Info Section
export const PersonalInfoSection = ({ userInfo, loading }) => {
  if (loading) return <SectionSkeleton />;

  return (
    <div className="animate-fadeIn">
      <header className="mb-8">
        <h2 className="text-xl font-secondary text-primary uppercase tracking-widest">Account Details</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: FiUser, label: "Full Name", value: userInfo?.name },
          { icon: FiMail, label: "Email Address", value: userInfo?.email },
          { icon: FiPhone, label: "Phone Number", value: userInfo?.phone || "Not provided" },
        ].map((item, idx) => (
          <div key={idx} className="bg-gray-50/50 border border-gray-100 p-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 text-grey-medium">
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-grey-medium font-bold">{item.label}</span>
              <span className="text-xs text-primary font-main font-semibold">{item.value || "N/A"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Orders Section
export const OrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <SectionSkeleton />;

  return (
    <div className="animate-fadeIn">
      <header className="mb-8">
        <h2 className="text-xl font-secondary text-primary uppercase tracking-widest">Orders</h2>
      </header>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-100 bg-white group p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-grey-medium font-bold">Order ID</p>
                    <p className="text-[10px] text-primary font-bold">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-grey-medium font-bold">Placed On</p>
                    <p className="text-[10px] text-primary">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-secondary mb-1">{order.status || "In Process"}</span>
                  <p className="text-sm font-bold text-primary">₹{order.totalAmount || order.price}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 flex items-center justify-center text-grey-medium">
                    <FiShoppingBag className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-primary font-bold">{order.productName || "Boutique Saree"}</p>
                </div>
                <button className="text-[9px] uppercase tracking-widest font-bold text-grey-medium hover:text-primary transition-colors">Details</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-ivory/30">
          <FiTruck className="w-12 h-12 text-ivory mx-auto mb-4" />
          <p className="text-sm font-main italic text-grey-medium">No orders found in your collection yet.</p>
          <button className="mt-6 text-[10px] uppercase tracking-widest font-bold text-secondary border-b border-secondary hover:text-primary hover:border-primary transition-all pb-1">Start Exploring</button>
        </div>
      )}
    </div>
  );
};

// Address Section
export const AddressSection = ({ userInfo, loading }) => {
  if (loading) return <SectionSkeleton />;

  return (
    <div className="animate-fadeIn">
      <header className="mb-8">
        <h2 className="text-xl font-secondary text-primary uppercase tracking-widest">Addresses</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-widest bg-gray-100 px-2 py-1 font-bold text-grey-medium">Default</span>
            <FiMapPin className="w-4 h-4 text-secondary" />
          </div>
          
          <div className="text-[11px] text-primary font-main leading-relaxed">
            <p className="font-bold mb-2 uppercase tracking-widest">Primary Residence</p>
            <p className="text-grey-medium">{userInfo?.name}</p>
            <p className="text-grey-medium">{userInfo?.address}</p>
            <p className="text-grey-medium">{userInfo?.city}, {userInfo?.state}, {userInfo?.pincode}</p>
          </div>

          <div className="flex items-center gap-4 mt-2 border-t border-gray-50 pt-4">
            <button className="text-[9px] uppercase tracking-widest font-bold text-secondary hover:text-primary transition-colors">Edit</button>
            <button className="text-[9px] uppercase tracking-widest font-bold text-grey-medium">Remove</button>
          </div>
        </div>

        <button className="border-2 border-dashed border-gray-100 p-6 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-all text-grey-medium">
          <span className="text-xl">+</span>
          <span className="text-[9px] uppercase tracking-widest font-bold">Add New</span>
        </button>
      </div>
    </div>
  );
};

// Shared Skeleton
const SectionSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="h-8 bg-ivory/30 w-1/3"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-24 bg-ivory/20 shadow-sm"></div>
      <div className="h-24 bg-ivory/20 shadow-sm"></div>
    </div>
  </div>
);
