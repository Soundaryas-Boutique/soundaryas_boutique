"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditUser() {
  const router = useRouter();
  const params = useParams();
  const email = params.email; // matches /profile/edit/[email] route

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user info
  useEffect(() => {
    if (!email) return;

    setLoading(true);
    fetch(`/api/users/${email}`)
      .then((res) => res.json())
      .then((data) => {
        setName(data.name || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setLoading(false);
      });
  }, [email]);

  // Handle save
  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/users/${email}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, address }),
    });

    if (res.ok) {
      router.push("/profile");
    } else {
      alert("Error updating user");
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center">Edit Profile</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form
          onSubmit={handleEdit}
          className="bg-yellow-200 p-4 rounded-lg shadow-md max-w-md mx-auto"
        >
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Phone:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
}
