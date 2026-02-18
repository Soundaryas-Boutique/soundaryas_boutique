"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiX } from "react-icons/fi";

export default function SignInModal({ isOpen, onClose, onSwitchToSignup }) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Clear state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setEmail("");
            setPassword("");
            setError("");
            setLoading(false);
        }
    }, [isOpen]);

    const handleCredentialsLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            setError("Invalid email or password");
            setLoading(false);
        } else {
            // Successful login
            onClose();
            router.refresh();
            // You can add logic here to redirect admins if needed
            // but for now, we just close the modal and refresh so Navbar updates
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
                        <Dialog.Panel className="w-full max-w-md bg-white shadow-premium relative overflow-hidden transition-all">
                            {/* Decorative Gradient Top */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-grey-medium hover:text-primary transition-colors z-10"
                            >
                                <FiX className="w-6 h-6" />
                            </button>

                            <div className="p-8 md:p-10">
                                <Dialog.Title className="text-3xl md:text-3xl font-secondary text-center mb-2 text-primary">
                                    Welcome Back
                                </Dialog.Title>

                                <div className="flex justify-center items-center gap-2 mb-6">
                                    <div className="h-[1px] w-8 bg-secondary/50"></div>
                                    <div className="w-1.5 h-1.5 rotate-45 border border-secondary"></div>
                                    <div className="h-[1px] w-8 bg-secondary/50"></div>
                                </div>

                                <p className="text-center text-grey-medium mb-8 font-main text-xs uppercase tracking-widest">
                                    Sign in to your account
                                </p>

                                {error && (
                                    <div className="bg-red-50 border-l-4 border-primary p-3 mb-6">
                                        <p className="text-primary text-xs font-medium">{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleCredentialsLogin} className="space-y-5">
                                    <div>
                                        <label className="block text-grey-dark text-[10px] font-bold uppercase tracking-wider mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-ivory/30 border border-secondary/30 focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-grey-medium/50 font-main text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-grey-dark text-[10px] font-bold uppercase tracking-wider mb-2">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-ivory/30 border border-secondary/30 focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-grey-medium/50 font-main text-sm"
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <Link
                                            href="/forgot-password"
                                            onClick={onClose}
                                            className="text-[10px] text-grey-medium hover:text-primary transition-colors uppercase tracking-wider"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full btn-primary disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Signing In..." : "Login"}
                                    </button>
                                </form>

                                <div className="mt-8 text-center border-t border-grey-medium/10 pt-6">
                                    <span className="text-grey-medium text-xs">New to Soundarya's? </span>
                                    <button
                                        onClick={onSwitchToSignup}
                                        className="text-primary hover:text-secondary font-medium transition-colors ml-1 uppercase text-xs tracking-wide"
                                    >
                                        Create Account
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
