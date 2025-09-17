"use client";
import React, { useState, useRef } from 'react';
import { 
  FiUser, 
  FiHeart, 
  FiShoppingCart, 
  FiMenu, 
  FiX, 
  FiMail 
} from 'react-icons/fi';
import Link from 'next/link';
import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";

const Navbar = () => {
  const { data: session, status } = useSession();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState(null);

  // Newsletter popup state
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Subscription popup state
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

  // Newsletter form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [exclusive, setExclusive] = useState(false);

  // Store subscription details
  const [subscriptionData, setSubscriptionData] = useState(null);

  const timeoutRef = useRef(null);

  const categories = [
    { name: "Silk Sarees", subcategories: ["Designer Silk", "Traditional Silk", "Printed Silk"], slug: "cat1" },
    { name: "Cotton Sarees", subcategories: ["Casual Cotton", "Fancy Cotton", "Printed Cotton"], slug: "cat2" },
    { name: "Kanchipuram", subcategories: ["Traditional Kanchipuram", "Modern Kanchipuram"], slug: "cat3" },
    { name: "Banarasi", subcategories: ["Traditional Banarasi", "Contemporary Banarasi"], slug: "cat1" },
  ];

  const handleCategoryEnter = (index) => {
    clearTimeout(timeoutRef.current);
    setActiveDropdown(index);
  };

  const handleCategoryLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    if (newState) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    if (!newState) {
      setActiveMobileCategory(null);
    }
  };

  const toggleMobileCategory = (index) => {
    setActiveMobileCategory(activeMobileCategory === index ? null : index);
  };

  const openPopup = () => {
    setIsPopupOpen(true);
    document.body.classList.add("overflow-hidden");
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    document.body.classList.remove("overflow-hidden");
    setName('');
    setEmail('');
    setPhone('');
    setExclusive(false);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    const formData = { name, email, phone, exclusive };

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSubscriptionData(formData); // ✅ Save subscription details
        alert("Subscribed successfully!");
        closePopup();
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="w-full shadow-sm border-b border-gray-200 sticky top-0 z-50 lg:static bg-white">
        <div className="max-w-[1440px] mx-auto px-4 py-4 flex items-center">
          {/* Hamburger Menu */}
          <div className="lg:hidden">
            <FiMenu 
              className="w-6 h-6 cursor-pointer text-[#8B0000]" 
              onClick={toggleMobileMenu}
            />
          </div>
          
          {/* Logo */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <div className="text-[#8B0000] text-xl tracking-wide font-semibold">
              <Link href="/" className="flex items-center">
                Soundarya&apos;s Boutique
              </Link>
            </div>
          </div>
          
          {/* Icons */}
          <div className="flex gap-6 items-center text-[#8B0000]">
            <Link href="/Profile" className="relative">
              <FiUser className="w-5 h-5 cursor-pointer hidden lg:block" />
            </Link>

            <FiHeart className="w-5 h-5 cursor-pointer hidden lg:block" />
            
            <button onClick={openPopup} className="hidden lg:block">
              <FiMail className="w-5 h-5 text-[#8B0000] cursor-pointer" />
            </button>
            
            <Link href={status === "authenticated"?"/Cart":"/Denied"} className="relative">
              <FiShoppingCart className="w-5 h-5 cursor-pointer" />
            </Link>

            {status === "authenticated" ? (
              <button onClick={() => redirect("/logoutsecurity")}>
                Logout
              </button>
            ) : (
              <button onClick={() => signIn()}>Login</button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Category Bar */}
      <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200 hidden lg:block">
        <div className="relative">
          <div className="flex justify-center gap-5 text-[#A52A2A] font-medium px-4 py-2">
            {categories.map((category, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => handleCategoryEnter(index)}
                onMouseLeave={handleCategoryLeave}
              >
                <Link
                  href={`/collections/${category.slug}`} 
                  className="flex items-center py-2 hover:text-[#8B0000]"
                >
                  {category.name}
                </Link>
                
                <div
                  className={`absolute bottom-1 left-0 w-full h-0.5 bg-[#8B0000] transition-transform duration-300 origin-left ${
                    activeDropdown === index ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-[2px] bg-transparent">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-semibold text-[#A52A2A]">Subscribe to our Newsletter</h3>
              <button onClick={closePopup}>
                <FiX className="w-6 h-6 text-gray-500 hover:text-[#8B0000]" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleNewsletterSubmit}>
              <p className="text-gray-600">Get the latest updates on new arrivals and special offers directly in your inbox.</p>
              
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3 border rounded-md"
                required
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border rounded-md"
                required
              />

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone"
                className="w-full p-3 border rounded-md"
              />

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={exclusive}
                  onChange={(e) => setExclusive(e.target.checked)}
                  className="h-4 w-4"
                />
                <label className="ml-2 text-gray-700">
                  Send me exclusive offers
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#A52A2A] text-white rounded-md"
              >
                Subscribe
              </button>
            </form>

            {/* View Subscription button */}
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  closePopup();
                  setIsSubscriptionOpen(true);
                }}
                className="text-[#8B0000] hover:underline"
              >
                View My Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Popup */}
      {isSubscriptionOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center backdrop-blur-[2px] bg-transparent">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-semibold text-[#A52A2A]">My Subscription</h3>
              <button onClick={() => setIsSubscriptionOpen(false)}>
                <FiX className="w-6 h-6 text-gray-600 hover:text-[#8B0000]" />
              </button>
            </div>

            {subscriptionData ? (
              <div className="space-y-3">
                <p><strong>Name:</strong> {subscriptionData.name}</p>
                <p><strong>Email:</strong> {subscriptionData.email}</p>
                <p><strong>Phone:</strong> {subscriptionData.phone || "N/A"}</p>
                <p>
                  <strong>Exclusive Offers:</strong>{" "}
                  {subscriptionData.exclusive ? "Yes ✅" : "No ❌"}
                </p>
              </div>
            ) : (
              <p className="text-gray-600">No subscription found.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
