"use client";
import { useState } from "react";
import CustomDropdown from './admin/CustomDropdown';

const professions = [
  { value: "Doctor", label: "Doctor" },
  { value: "Teacher", label: "Teacher" },
  { value: "Engineer", label: "Engineer" },
  { value: "Student", label: "Student" },
  { value: "Other", label: "Other" },
];

const subscriptionTypes = [
  { value: "Weekly", label: "Weekly" },
  { value: "Monthly", label: "Monthly" },
  { value: "Yearly", label: "Yearly" },
];

const Newsletter = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState("Other");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [exclusiveOffer, setExclusiveOffer] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState("Monthly");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!email || !profession || !gender || !subscriptionType) {
      setMessage("Email, profession, gender, and subscription type are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, profession, phone, gender, exclusiveOffer, subscriptionType }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setEmail("");
        setProfession("Other");
        setPhone("");
        setGender("");
        setExclusiveOffer(false);
        setSubscriptionType("Monthly");
        setTimeout(onClose, 3000);
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("❌ Subscription error:", error);
      setMessage("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleNewsletterSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full p-3 border rounded-md"
        required
      />

      <CustomDropdown
        options={professions}
        value={profession}
        onChange={setProfession}
        placeholder="Select your profession"
        className="w-full"
      />

      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Enter your phone number (optional)"
        className="w-full p-3 border rounded-md"
      />

      {/* Gender */}
      <div className="flex gap-4">
        {["Male", "Female", "Other"].map((g) => (
          <label key={g} className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              value={g}
              checked={gender === g}
              onChange={(e) => setGender(e.target.value)}
              required
            />
            {g}
          </label>
        ))}
      </div>

      {/* Exclusive Offer */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={exclusiveOffer}
          onChange={(e) => setExclusiveOffer(e.target.checked)}
        />
        I want to receive exclusive offers
      </label>

      {/* Subscription Type */}
      <CustomDropdown
        options={subscriptionTypes}
        value={subscriptionType}
        onChange={setSubscriptionType}
        placeholder="Select subscription type"
        className="w-full"
      />

      {message && (
        <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#A52A2A] text-white rounded-md disabled:opacity-50"
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
    </form>
  );
};

export default Newsletter;
