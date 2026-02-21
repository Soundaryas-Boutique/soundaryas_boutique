"use client";

import { getProviders, signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [providers, setProviders] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getProviders().then((prov) => setProviders(prov));
    setLoaded(true);
  }, []);

  // 🐛 FIX: Moved redirection logic into useEffect to avoid updating state during render
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.role === "admin") {
        router.push("/admin/products");
      } else {
        router.push("/");
      }
    }
  }, [status, session, router]);

  // Session loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen silk-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      // The useEffect hook above will handle the redirection automatically
      // after a successful sign-in
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center silk-bg overflow-hidden">
      {status === "unauthenticated" && providers ? (
        Object.values(providers).map((provider, index) => {
          if (provider.id === "credentials") {
            return (
              <form
                key={provider.id}
                onSubmit={handleCredentialsLogin}
                className={`w-full max-w-md bg-white p-8 md:p-10 shadow-premium transition-all duration-1000 ease-out relative ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                style={{ transitionDelay: `${200 + index * 200}ms` }}
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>

                <h2 className="text-3xl md:text-4xl font-secondary text-center mb-2 text-primary">
                  Welcome Back
                </h2>

                <div className="flex justify-center items-center gap-2 mb-6">
                  <div className="h-[1px] w-8 bg-secondary/50"></div>
                  <div className="w-1.5 h-1.5 rotate-45 border border-secondary"></div>
                  <div className="h-[1px] w-8 bg-secondary/50"></div>
                </div>

                <p className="text-center text-grey-medium mb-8 font-main text-sm uppercase tracking-widest">
                  Sign in to your account
                </p>

                {error && (
                  <div className="bg-red-50 border-l-4 border-primary p-4 mb-6">
                    <p className="text-primary text-sm font-medium">{error}</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-grey-dark text-xs font-bold uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-ivory/30 border border-secondary/30 focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-grey-medium/50 font-main"
                    />
                  </div>

                  <div>
                    <label className="block text-grey-dark text-xs font-bold uppercase tracking-wider mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-ivory/30 border border-secondary/30 focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-grey-medium/50 font-main"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-2 mb-6">
                  <Link
                    href="/forgot-password"
                    className="text-xs text-grey-medium hover:text-primary transition-colors uppercase tracking-wider"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary"
                >
                  Login
                </button>

                <div className="mt-8 text-center border-t border-grey-medium/10 pt-6">
                  <span className="text-grey-medium text-sm">New to Soundarya's? </span>
                  <Link
                    href="/CreateUser"
                    className="text-primary hover:text-secondary font-medium transition-colors ml-1 uppercase text-sm tracking-wide"
                  >
                    Create Account
                  </Link>
                </div>
              </form>
            );
          }
          return null;
        })
      ) : (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary font-secondary text-xl">Loading login experience...</p>
        </div>
      )}
    </div>
  );
}