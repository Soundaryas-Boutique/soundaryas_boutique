"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useUserInfo from "@/app/hooks/useUserInfo";
import Link from "next/link";

export default function ComplaintPage() {
  const { data: session } = useSession();
  const email = session?.user?.email;

  const { userInfo } = useUserInfo(email);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderId: "",
    complaint: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Auto-fill when userInfo is loaded
  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        name: userInfo.name || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
      }));
    }
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Complaint Submitted:", formData);
    // send to API here if needed
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 bg-green-100 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-semibold mb-2">✅ Complaint Registered</h2>
          <p className="text-gray-700 mb-6">
            Our team will contact you soon.
          </p>
          <Link href="/">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
              Back to Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Complaint Registration
        </h1>

        <label className="block mb-3">
          <span className="text-gray-700">Name</span>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border p-2 rounded-lg"
          />
        </label>

        <label className="block mb-3">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border p-2 rounded-lg"
          />
        </label>

        <label className="block mb-3">
          <span className="text-gray-700">Phone</span>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full border p-2 rounded-lg"
          />
        </label>

        <label className="block mb-3">
          <span className="text-gray-700">Order ID (optional)</span>
          <input
            type="text"
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            className="mt-1 block w-full border p-2 rounded-lg"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Complaint</span>
          <textarea
            name="complaint"
            required
            value={formData.complaint}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full border p-2 rounded-lg"
          ></textarea>
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
}
