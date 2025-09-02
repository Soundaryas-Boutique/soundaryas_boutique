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

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  // Regex patterns
  const namePattern = /^[A-Za-z\s]{2,50}$/;
  const phonePattern = /^(?:\+91)?[6-9]\d{9}$/;
  const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || !namePattern.test(formData.name)) {
      newErrors.name = "Please enter a valid name (letters only, 2-50 chars).";
    }

    if (!formData.phone || !phonePattern.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit Indian phone number.";
    }

    if (!formData.email || !emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.subject || formData.subject.length < 3 || formData.subject.length > 100) {
      newErrors.subject = "Subject must be 3-100 characters long.";
    }

    if (!formData.message || formData.message.length < 10 || formData.message.length > 500) {
      newErrors.message = "Message must be 10-500 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop submission if validation fails

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Form submitted successfully!");
        setFormData({
          name: "",
          phone: "",
          email: "",
          subject: "",
          message: "",
        });
        setStatus("");
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to submit form.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate 
      className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-[#B22222]">
        Contact Us
      </h2>

      <div>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B22222] outline-none ${
            errors.name ? "border-red-500" : ""
          }`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <input
          type="tel"
          name="phone"
          placeholder="Your Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B22222] outline-none ${
            errors.phone ? "border-red-500" : ""
          }`}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B22222] outline-none ${
            errors.email ? "border-red-500" : ""
          }`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B22222] outline-none ${
            errors.subject ? "border-red-500" : ""
          }`}
        />
        {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
      </div>

      <div>
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          rows="4"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#B22222] outline-none ${
            errors.message ? "border-red-500" : ""
          }`}
        />
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
      </div>

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
