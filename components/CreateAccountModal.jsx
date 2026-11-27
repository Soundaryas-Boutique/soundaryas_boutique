"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiX } from "react-icons/fi";

const INITIAL_FORM_STATE = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function CreateAccountModal({ isOpen, onClose, onSwitchToSignIn }) {
  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const resetState = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrorMessage("");
    setLoading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSwitchToSignIn = () => {
    resetState();
    onSwitchToSignIn();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/Users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data?.message || "Failed to create account");
        setLoading(false);
        return;
      }

      // Automatically sign in upon successful registration
      const loginRes = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      setLoading(false);

      if (loginRes?.error) {
        handleSwitchToSignIn();
      } else {
        handleClose();
        router.refresh();
      }
    } catch (error) {
      console.error("Account creation error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={handleClose} className="relative z-[200]">
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
            <Dialog.Panel className="w-full max-w-md bg-white shadow-premium relative overflow-hidden transition-all max-h-[90vh] overflow-y-auto">
              {/* Decorative Gradient Top */}
              <div className="w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary sticky top-0 z-10" />

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close create account modal"
                className="absolute top-4 right-4 text-grey-medium hover:text-primary transition-colors z-20 bg-white rounded-full p-2 flex items-center justify-center min-w-[44px] min-h-[44px]"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="p-8 sm:p-10">
                <Dialog.Title className="text-3xl font-secondary text-center mb-2 text-primary">
                  Create Account
                </Dialog.Title>

                <div className="flex justify-center items-center gap-2 mb-6">
                  <div className="h-px w-8 bg-secondary/50" />
                  <div className="w-1.5 h-1.5 rotate-45 border border-secondary" />
                  <div className="h-px w-8 bg-secondary/50" />
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Name */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="modal-name"
                      className="text-grey-dark text-xs font-bold uppercase tracking-wider mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      id="modal-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      onChange={handleChange}
                      value={formData.name}
                      required
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-4 py-3 bg-ivory/30 border border-secondary/30 focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-grey-medium/50 font-main text-base"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="modal-email"
                      className="text-grey-dark text-xs font-bold uppercase tracking-wider mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="modal-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      onChange={handleChange}
                      value={formData.email}
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-ivory/30 border border-secondary/30 focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-grey-medium/50 font-main text-base"
                    />
                  </div>

                  {/* Password */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="modal-password"
                      className="text-grey-dark text-xs font-bold uppercase tracking-wider mb-2"
                    >
                      Password
                    </label>
                    <input
                      id="modal-password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      onChange={handleChange}
                      value={formData.password}
                      required
                      minLength={6}
                      placeholder="At least 6 characters"
                      className="w-full px-4 py-3 bg-ivory/30 border border-secondary/30 focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-grey-medium/50 font-main text-base"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="modal-confirmPassword"
                      className="text-grey-dark text-xs font-bold uppercase tracking-wider mb-2"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="modal-confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      onChange={handleChange}
                      value={formData.confirmPassword}
                      required
                      minLength={6}
                      placeholder="Re-enter your password"
                      className="w-full px-4 py-3 bg-ivory/30 border border-secondary/30 focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-grey-medium/50 font-main text-base"
                    />
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="bg-red-50 border-l-4 border-primary p-3 text-center">
                      <p className="text-primary text-sm font-medium">{errorMessage}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary disabled:opacity-70 mt-2 py-3"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </form>

                {/* Switch to Sign In */}
                <div className="mt-6 text-center border-t border-grey-medium/10 pt-5">
                  <span className="text-grey-medium text-sm">Already have an account? </span>
                  <button
                    type="button"
                    onClick={handleSwitchToSignIn}
                    className="text-primary hover:text-secondary font-medium transition-colors ml-1 uppercase text-sm tracking-wide"
                  >
                    Sign In
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
