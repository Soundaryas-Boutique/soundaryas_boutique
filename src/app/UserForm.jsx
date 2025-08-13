"use client";
import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const UserForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    state: "",
    country: "",
    pincode: "",
    city: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  // Country options
  const countryOptions = useMemo(() => countryList().getData(), []);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      country: selected.label,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // ✅ Password match check
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // ✅ Additional password validation (optional: length, characters)
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }
  

    const res = await fetch("/api/Users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formData }),
    });

    if (!res.ok) {
      const { message } = await res.json();
      setErrorMessage(message || "Something went wrong");
      return;
    }

    router.refresh();
    router.push("/signin");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6 sm:p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Create New Account
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              name="name"
              type="text"
              onChange={handleChange}
              value={formData.name}
              className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              onChange={handleChange}
              value={formData.email}
              className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              value={formData.password}
              className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              onChange={handleChange}
              value={formData.confirmPassword}
              className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1">Phone</label>
            <PhoneInput
              country={"in"}
              value={formData.phone}
              onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
              inputClass="!w-full !h-10 !text-sm"
              containerClass="w-full"
            />
          </div>

          {/* Street */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Street</label>
            <input
              name="address"
              type="text"
              onChange={handleChange}
              value={formData.address}
              className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Pincode */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Pincode</label>
            <input
              name="pincode"
              type="text"
              onChange={handleChange}
              value={formData.pincode}
              className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* City */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              name="city"
              type="text"
              onChange={handleChange}
              value={formData.city}
              className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* State */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              name="state"
              type="text"
              onChange={handleChange}
              value={formData.state}
              className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Country */}
          <div className="flex flex-col col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1">Country</label>
            <Select
              options={countryOptions}
              onChange={handleCountryChange}
              className="text-sm"
              placeholder="Select your country"
            />
          </div>

          {/* Submit */}
          <div className="col-span-2 mt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 shadow-md"
            >
              Create Account
            </button>
          </div>
        </form>

        {errorMessage && (
          <p className="text-red-500 text-center text-sm mt-4">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default UserForm;
