"use client";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import CustomDropdown from './admin/CustomDropdown'; // Assuming you have this component

const professions = [
  { value: "Doctor", label: "Doctor" },
  { value: "Teacher", label: "Teacher" },
  { value: "Engineer", label: "Engineer" },
  { value: "Student", label: "Student" },
  { value: "Other", label: "Other" },
];

const Newsletter = ({ isPopupOpen, setIsPopupOpen }) => {
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState("Other");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const closePopup = () => {
    setIsPopupOpen(false);
    document.body.classList.remove("overflow-hidden");
    setEmail("");
    setProfession("Other");
    setPhone("");
    setMessage("");
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!email || !profession || !phone) { // ✅ Added phone to the required fields
      setMessage("Email, phone, and profession are required.");
      setLoading(false);
      return;
    }
    if (phone && !/^\d{10}$/.test(phone)) {
      setMessage("Please enter a valid 10-digit phone number.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, profession, phone }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setEmail("");
        setProfession("Other");
        setPhone("");
        setTimeout(closePopup, 3000);
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
    <>
      {isPopupOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-[2px] bg-transparent">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-semibold text-[#A52A2A]">
                📩 Subscribe to our Newsletter
              </h3>
              <button onClick={closePopup}>
                <FiX className="w-6 h-6 text-gray-500 hover:text-[#8B0000]" />
              </button>
            </div>

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
                placeholder="Enter your 10-digit phone number"
                className="w-full p-3 border rounded-md"
                required // ✅ Made phone number input required
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
          </div>
        </div>
      )}
    </>
  );
};

export default Newsletter;