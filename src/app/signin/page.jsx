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
      if (session.user.role === "Admin") {
        router.push("/admin/products");
      } else {
        router.push("/");
      }
    }
  }, [status, session, router]);

  // Session loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700 text-2xl">Loading session...</p>
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
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      {status === "unauthenticated" && providers ? (
        Object.values(providers).map((provider, index) => {
          if (provider.id === "credentials") {
            return (
              <form
                key={provider.id}
                onSubmit={handleCredentialsLogin}
                className={`w-[500px] p-6 rounded-lg shadow transition-all duration-1000 bg-gray-200 ease-out ${
                  loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${800 + index * 200}ms` }}
              >
                <h2 className="text-2xl font-semibold text-center mb-4">
                  Sign in with Email
                </h2>
                {error && (
                  <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
                )}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full mb-3 px-4 py-2 mt-3 border rounded-lg focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mb-4 px-4 mt-3 py-2 border rounded-lg focus:outline-none"
                />

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg mt-3 font-semibold bg-blue-600 text-white hover:bg-blue-700"
                >
                  Login
                </button>

                <div className="mt-10 text-center">
                  New User?{" "}
                  <Link
                    href="/CreateUser"
                    className="text-blue-500 hover:underline"
                  >
                    Create Account
                  </Link>
                </div>

                <div className="mt-4 text-center">
                  <Link
                    href="/forgot-password"
                    className="text-blue-500 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </form>
            );
          }
          return null;
        })
      ) : (
        <p className="text-black">Loading sign-in options...</p>
      )}
    </div>
  );
}