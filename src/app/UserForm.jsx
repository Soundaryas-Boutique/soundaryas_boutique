"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

const UserForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

      // Automatically sign in upon registration
      const loginRes = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      setLoading(false);

      if (loginRes?.error) {
        router.push("/signin");
      } else {
        router.refresh();
        router.push("/");
      }
    } catch (error) {
      console.error("Account creation error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-16 min-h-screen silk-bg px-4">
      <div className="w-full max-w-md bg-white shadow-premium relative overflow-hidden transition-all">
        {/* Decorative Gradient Top */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

        <div className="p-8 sm:p-10">
          <h1 className="text-3xl font-secondary text-center mb-2 text-primary">
            Create Account
          </h1>

          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="h-px w-8 bg-secondary/50" />
            <div className="w-1.5 h-1.5 rotate-45 border border-secondary" />
            <div className="h-px w-8 bg-secondary/50" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col">
              <label
                htmlFor="userform-name"
                className="text-grey-dark text-xs font-bold uppercase tracking-wider mb-2"
              >
                Full Name
              </label>
              <input
                id="userform-name"
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
                htmlFor="userform-email"
                className="text-grey-dark text-xs font-bold uppercase tracking-wider mb-2"
              >
                Email Address
              </label>
              <input
                id="userform-email"
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
                htmlFor="userform-password"
                className="text-grey-dark text-xs font-bold uppercase tracking-wider mb-2"
              >
                Password
              </label>
              <input
                id="userform-password"
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
                htmlFor="userform-confirmPassword"
                className="text-grey-dark text-xs font-bold uppercase tracking-wider mb-2"
              >
                Confirm Password
              </label>
              <input
                id="userform-confirmPassword"
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
            <Link
              href="/signin"
              className="text-primary hover:text-secondary font-medium transition-colors ml-1 uppercase text-sm tracking-wide"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
