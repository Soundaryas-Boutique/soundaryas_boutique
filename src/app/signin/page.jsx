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

  // Session loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white text-2xl">Loading session...</p>
      </div>
    );
  }

  // If already signed in, redirect or show message
  if (status === "authenticated" && session?.user) {
    router.push("/"); // Change to your dashboard/home
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-green-500 text-2xl">
          You are already signed in as {session.user.email}
        </p>
      </div>
    );
  }

  const getButtonConfig = (providerId) => {
    switch (providerId) {

      case "credentials":
        return {
          label: "Sign in with Email",
          bg: "bg-blue-600 text-white hover:bg-blue-700",
          icon: "/email.png",
        };
      default:
        return {
          label: `Sign in with ${providerId}`,
          bg: "bg-gray-500 text-white hover:bg-gray-600",
          icon: "/default.png",
        };
    }
  };

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/",
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 ">
      {status === "unauthenticated" && providers ? (
        Object.values(providers).map((provider, index) => {
          const config = getButtonConfig(provider.id);

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
                  {config.label}
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
                  className={`w-full py-2 rounded-lg mt-3 font-semibold ${config.bg}`}
                >
                  Login
                </button>
                <div className="mt-10">
                  New User ? <span>
                    <Link href="/CreateUser" className="text-blue-500 hover:underline mt-20">
                      Create Account
                    </Link>
                  </span>
                </div>
                <div className="mt-4">
        <Link href="/forgot-password" className="text-blue-500 hover:underline">
          Forgot your password?
        </Link>
      </div>
              </form>
            );
          }

          return (
            <div
              key={provider.id}
              className={`transition-all duration-1000 ease-out ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${800 + index * 200}ms` }}
            >
              <button
                onClick={() =>
                  signIn(provider.id, {
                    callbackUrl: "/",
                    prompt: "select_account",
                  })
                }
                className={`flex items-center gap-4 px-6 py-3 rounded-full font-semibold text-lg shadow hover:scale-105 transition-all duration-300 ${config.bg}`}
              >
                <img
                  src={config.icon}
                  alt={provider.name}
                  className="h-8 w-8 rounded-full"
                />
                {config.label}
              </button>
            </div>
          );
        })
      ) : (
        <p className="text-black">Loading sign-in options...</p>
      )}
    </div>
  );
}
