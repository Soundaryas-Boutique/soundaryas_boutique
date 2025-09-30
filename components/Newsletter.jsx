"use client";
import { useState } from "react";
import { FiX } from "react-icons/fi";

const Newsletter = ({ isPopupOpen, setIsPopupOpen }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const closePopup = () => {
    setIsPopupOpen(false);
    document.body.classList.remove("overflow-hidden");
    setEmail(""); // Reset the email state
    setMessage(""); // Reset message
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!email) {
      setMessage("Email is required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setEmail("");
        setTimeout(closePopup, 3000); // Close popup after 3 seconds
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