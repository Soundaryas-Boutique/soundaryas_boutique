"use client";

import { Fragment, useState, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { FiX } from "react-icons/fi";
import Select from "react-select";
import countryList from "react-select-country-list";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function CreateAccountModal({ isOpen, onClose, onSwitchToSignIn }) {
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
    const [loading, setLoading] = useState(false);

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
        setLoading(true);

        // Password match check
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match");
            setLoading(false);
            return;
        }

        // Additional password validation
        if (formData.password.length < 6) {
            setErrorMessage("Password must be at least 6 characters long");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/Users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ formData }),
            });

            if (!res.ok) {
                const { message } = await res.json();
                setErrorMessage(message || "Something went wrong");
                setLoading(false);
                return;
            }

            // Success
            setLoading(false);
            onSwitchToSignIn(); // Switch to sign in modal after successful registration
            // optionally show a success message or toast
        } catch (error) {
            console.error(error);
            setErrorMessage("An error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-[200]">
                {/* Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                </Transition.Child>

                {/* Modal Content */}
                <Transition.Child
                    as={Fragment}
                    enter="transition-transform ease-out duration-300"
                    enterFrom="scale-95 opacity-0 translate-y-4"
                    enterTo="scale-100 opacity-100 translate-y-0"
                    leave="transition-transform ease-in duration-200"
                    leaveFrom="scale-100 opacity-100 translate-y-0"
                    leaveTo="scale-95 opacity-0 translate-y-4"
                >
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="w-full max-w-2xl bg-white shadow-premium relative overflow-hidden transition-all max-h-[90vh] overflow-y-auto no-scrollbar">
                            {/* Decorative Gradient Top */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary sticky z-10" />

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-grey-medium hover:text-primary transition-colors z-20 bg-white rounded-full p-1"
                            >
                                <FiX className="w-6 h-6" />
                            </button>

                            <div className="p-8 md:p-10">
                                <Dialog.Title className="text-3xl md:text-3xl font-secondary text-center mb-2 text-primary">
                                    Create Account
                                </Dialog.Title>

                                <div className="flex justify-center items-center gap-2 mb-6">
                                    <div className="h-[1px] w-8 bg-secondary/50"></div>
                                    <div className="w-1.5 h-1.5 rotate-45 border border-secondary"></div>
                                    <div className="h-[1px] w-8 bg-secondary/50"></div>
                                </div>

                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Name */}
                                    <div className="flex flex-col">
                                        <label className="text-grey-dark text-[10px] font-bold uppercase tracking-wider mb-2">Name</label>
                                        <input
                                            name="name"
                                            type="text"
                                            onChange={handleChange}
                                            value={formData.name}
                                            required
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
                                            required
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
                                            required
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
                                            required
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
                                    <div className="md:col-span-2 mt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full btn-primary disabled:opacity-70"
                                        >
                                            {loading ? "Creating Account..." : "Create Account"}
                                        </button>
                                    </div>
                                </form>

                                {errorMessage && (
                                    <div className="mt-6 bg-red-50 border-l-4 border-primary p-4 text-center">
                                        <p className="text-primary text-sm font-medium">{errorMessage}</p>
                                    </div>
                                )}

                                <div className="mt-8 text-center border-t border-grey-medium/10 pt-6">
                                    <span className="text-grey-medium text-xs">Already have an account? </span>
                                    <button
                                        onClick={onSwitchToSignIn}
                                        className="text-primary hover:text-secondary font-medium transition-colors ml-1 uppercase text-xs tracking-wide"
                                    >
                                        Login
                                    </button>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
