"use client";
import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("Message sent successfully ✅");
        setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
      } else {
        setStatus("Something went wrong ❌");
      }
    } catch (error) {
      setStatus("Error sending message ❌");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-[#B22222]">
        Contact Us
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B22222] outline-none"
      />

      <input
        type="tel"
        name="phone"
        placeholder="Your Phone Number"
        value={formData.phone}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B22222] outline-none"
      />

      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B22222] outline-none"
      />

      <input
        type="text"
        name="subject"
        placeholder="Subject"
        value={formData.subject}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B22222] outline-none"
      />

      <textarea
        name="message"
        placeholder="Your Message"
        value={formData.message}
        onChange={handleChange}
        required
        rows="4"
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B22222] outline-none"
      />

      <button
        type="submit"
        className="w-full py-2 px-4 bg-[#B22222] text-white rounded-lg hover:bg-red-700 transition"
      >
        Send Message
      </button>

      {status && <p className="text-center text-sm mt-2">{status}</p>}
    </form>
  );
}
