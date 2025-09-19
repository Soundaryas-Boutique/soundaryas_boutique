"use client";
import React, { useState, useRef } from "react";
import { 
  FiUser, 
  FiHeart, 
  FiShoppingCart, 
  FiMenu, 
  FiMail 
} from "react-icons/fi";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import Newsletter from "./Newsletter";

const Navbar = () => {
  const { data: session, status } = useSession();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState(null);

  // Newsletter states
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

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
                Soundaryas
              </Link>
            </div>
          </div>

          {/* Icons */}
          <div className="flex gap-6 items-center text-[#8B0000]">
            <Link href="/Profile" className="relative">
              <FiUser className="w-5 h-5 cursor-pointer hidden lg:block" />
            </Link>

            <FiHeart className="w-5 h-5 cursor-pointer hidden lg:block" />

            <button onClick={() => setIsPopupOpen(true)} className="hidden lg:block">
              <FiMail className="w-5 h-5 text-[#8B0000] cursor-pointer" />
            </button>

            <Link
              href={status === "authenticated" ? "/Cart" : "/Denied"}
              className="relative"
            >
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
                    activeDropdown === index
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Component */}
      <Newsletter
        isPopupOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen}
        isSubscriptionOpen={isSubscriptionOpen}
        setIsSubscriptionOpen={setIsSubscriptionOpen}
        subscriptions={subscriptions}
        setSubscriptions={setSubscriptions}
      />
    </>
  );
};

export default Navbar;
