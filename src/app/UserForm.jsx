"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const UserForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const res = await fetch("/api/Users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
      });
      
      

    if (!res.ok) {
      const { message } = await res.json();
      setErrorMessage(message || "Something went wrong");
      return;
    }

    router.refresh();
    router.push("/login");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
        <h1>Create new user</h1>

        <label>Name</label>
        <input name="name" type="text" onChange={handleChange} value={formData.name} className="border border-gray-300 p-2 rounded-md" />

        <label>Email</label>
        <input name="email" type="email" onChange={handleChange} value={formData.email} className="border border-gray-300 p-2 rounded-md" />

        <label>Password</label>
        <input name="password" type="password" onChange={handleChange} value={formData.password} className="border border-gray-300 p-2 rounded-md" />

        <label>Phone</label>
        <input name="phone" type="number" onChange={handleChange} value={formData.phone} className="border border-gray-300 p-2 rounded-md" />

        <label>Address</label>
        <input name="address" type="text" onChange={handleChange} value={formData.address} className="border border-gray-300 p-2 rounded-md" />

        <input type="submit" value="Create User" className="bg-blue-500 text-white p-2 rounded-md cursor-pointer" />
      </form>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </>
  );
};

export default UserForm;
