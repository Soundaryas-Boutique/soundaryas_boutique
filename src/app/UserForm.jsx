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
    <div className="flex justify-center items-center py-20 min-h-screen silk-bg px-4">
      <div className="w-full max-w-2xl bg-white shadow-premium relative overflow-hidden transition-all">
        {/* Decorative Gradient Top */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

        <div className="p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-secondary text-center mb-2 text-primary">
            Create Account
          </h1>

          <div className="flex justify-center items-center gap-2 mb-8">
            <div className="h-[1px] w-8 bg-secondary/50"></div>
            <div className="w-1.5 h-1.5 rotate-45 border border-secondary"></div>
            <div className="h-[1px] w-8 bg-secondary/50"></div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex flex-col">
              <label className="text-grey-dark text-[10px] font-bold uppercase tracking-wider mb-2">Name</label>
              <input
                name="name"
                type="text"
                onChange={handleChange}
                value={formData.name}
                className="w-full px-4 py-3 bg-ivory/30 border border-secondary/30 focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-grey-medium/50 font-main text-sm"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-grey-dark text-[10px] font-bold uppercase tracking-wider mb-2">Email</label>
              <input
                name="email"
                type="email"
                onChange={handleChange}
                value={formData.email}
                className="w-full px-4 py-3 bg-ivory/30 border border-secondary/30 focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-grey-medium/50 font-main text-sm"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="text-grey-dark text-[10px] font-bold uppercase tracking-wider mb-2">Password</label>
              <input
                name="password"
                type="password"
                onChange={handleChange}
                value={formData.password}
                className="w-full px-4 py-3 bg-ivory/30 border border-secondary/30 focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-grey-medium/50 font-main text-sm"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <label className="text-grey-dark text-[10px] font-bold uppercase tracking-wider mb-2">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                onChange={handleChange}
                value={formData.confirmPassword}
                className="w-full px-4 py-3 bg-ivory/30 border border-secondary/30 focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-grey-medium/50 font-main text-sm"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col md:col-span-2">
              <label className="text-grey-dark text-[10px] font-bold uppercase tracking-wider mb-2">Phone</label>
              <PhoneInput
                country={"in"}
                value={formData.phone}
                onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
                inputClass="!w-full !h-[46px] !text-sm !bg-ivory/30 !border-secondary/30 !rounded-none focus:!border-primary !font-main"
                containerClass="w-full"
                buttonClass="!bg-ivory/30 !border-secondary/30 !rounded-none"
              />
            </div>

            {/* Street */}
            <div className="flex flex-col">
              <label className="text-grey-dark text-[10px] font-bold uppercase tracking-wider mb-2">Street</label>
              <input
                name="address"
                type="text"
                onChange={handleChange}
                value={formData.address}
                className="w-full px-4 py-3 bg-ivory/30 border border-secondary/30 focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-grey-medium/50 font-main text-sm"
              />
            </div>

            {/* Pincode */}
            <div className="flex flex-col">
              <label className="text-grey-dark text-[10px] font-bold uppercase tracking-wider mb-2">Pincode</label>
              <input
                name="pincode"
                type="text"
                onChange={handleChange}
                value={formData.pincode}
                className="w-full px-4 py-3 bg-ivory/30 border border-secondary/30 focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-grey-medium/50 font-main text-sm"
              />
            </div>

            {/* City */}
            <div className="flex flex-col">
              <label className="text-grey-dark text-[10px] font-bold uppercase tracking-wider mb-2">City</label>
              <input
                name="city"
                type="text"
                onChange={handleChange}
                value={formData.city}
                className="w-full px-4 py-3 bg-ivory/30 border border-secondary/30 focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-grey-medium/50 font-main text-sm"
              />
            </div>

            {/* State */}
            <div className="flex flex-col">
              <label className="text-grey-dark text-[10px] font-bold uppercase tracking-wider mb-2">State</label>
              <input
                name="state"
                type="text"
                onChange={handleChange}
                value={formData.state}
                className="w-full px-4 py-3 bg-ivory/30 border border-secondary/30 focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-grey-medium/50 font-main text-sm"
              />
            </div>

            {/* Country */}
            <div className="flex flex-col md:col-span-2">
              <label className="text-grey-dark text-[10px] font-bold uppercase tracking-wider mb-2">Country</label>
              <Select
                options={countryOptions}
                onChange={handleCountryChange}
                className="text-sm font-main"
                placeholder="Select your country"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: 'rgba(255, 253, 208, 0.3)', // bg-ivory/30
                    borderColor: 'rgba(212, 175, 55, 0.3)', // border-secondary/30
                    borderRadius: 0,
                    padding: '2px',
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: '#B71C1C' // border-primary
                    }
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected ? '#B71C1C' : state.isFocused ? 'rgba(212, 175, 55, 0.1)' : 'white',
                    color: state.isSelected ? 'white' : 'black',
                  })
                }}
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2 mt-6">
              <button
                type="submit"
                className="w-full btn-primary"
              >
                Create Account
              </button>
            </div>
          </form>

          {errorMessage && (
            <div className="mt-6 bg-red-50 border-l-4 border-primary p-4 text-center">
              <p className="text-primary text-sm font-medium">{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserForm;
