"use client";
import React, { useState, useRef } from "react";
import {
FiUser,
FiHeart,
FiShoppingCart,
FiMenu,
FiMail,
FiX,
FiChevronDown,
FiChevronUp
} from "react-icons/fi";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Newsletter from "./Newsletter";

const Navbar = () => {
const { data: session, status } = useSession();
const router = useRouter();

const [activeDropdown, setActiveDropdown] = useState(null);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [activeMobileCategory, setActiveMobileCategory] = useState(null);
const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

// Newsletter popup state
const [isPopupOpen, setIsPopupOpen] = useState(false);

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
{/* Top Bar */} <div className="w-full shadow-sm border-b border-gray-200 sticky top-0 z-50 lg:static bg-white"> <div className="max-w-[1440px] mx-auto px-4 py-4 flex items-center">
{/* Hamburger Menu */} <div className="lg:hidden"> <FiMenu
           className="w-6 h-6 cursor-pointer text-[#8B0000]"
           onClick={toggleMobileMenu}
         /> </div>

```
      {/* Logo */}
      <div className="flex-1 flex justify-center lg:justify-start">
        <div className="text-[#8B0000] text-xl tracking-wide font-semibold">
          <Link href="/" className="flex items-center">
            Soundaryas Boutique
          </Link>
        </div>
      </div>

      {/* Icons */}
      <div className="flex gap-6 items-center text-[#8B0000]">
        {status === "authenticated" ? (
          <div className="relative hidden lg:block">
            <button
              className="flex items-center"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              <FiUser className="w-5 h-5 cursor-pointer" />
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <Link href="/Profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  View Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="hidden lg:block text-[#8B0000] font-medium hover:text-[#A52A2A]"
          >
            Login
          </button>
        )}

        <FiHeart className="w-5 h-5 cursor-pointer hidden lg:block" />

        {/* ✅ Newsletter Popup Trigger */}
        <button onClick={() => setIsPopupOpen(true)} className="hidden lg:block">
          <FiMail className="w-5 h-5 text-[#8B0000] cursor-pointer" />
        </button>

        <Link
          href={status === "authenticated" ? "/Cart" : "/Denied"}
          className="relative"
        >
          <FiShoppingCart className="w-5 h-5 cursor-pointer" />
        </Link>
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

  {/* ✅ Mobile Menu Overlay */}
  <div className={`fixed inset-y-0 left-0 w-2/3 max-w-xs z-50 bg-white overflow-y-auto transition-all duration-300 ease-in-out transform ${
    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
  }`}>
    <div className="p-4">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <h2 className="text-2xl font-bold">Menu</h2>
        <FiX className="w-6 h-6 cursor-pointer text-[#8B0000]" onClick={toggleMobileMenu} />
      </div>
      
      <nav className="mt-4 text-base font-medium space-y-1">
        <Link href="/" className="block py-3 px-2 border-b border-gray-100 hover:bg-gray-50">
          HOME
        </Link>

        {categories.map((category, index) => (
          <div key={index} className="border-b border-gray-100">
            <div 
              className="flex justify-between items-center py-3 px-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleMobileCategory(index)}
            >
              <span className="text-base font-medium text-gray-800">{category.name}</span>
              {activeMobileCategory === index ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${
              activeMobileCategory === index ? 'max-h-[500px]' : 'max-h-0'
            }`}>
              {category.subcategories.map((sub, subIndex) => (
                <a 
                  key={subIndex} 
                  href="#"
                  className="block py-3 px-6 text-sm font-normal text-gray-600 hover:text-[#8B0000] hover:bg-gray-50 transition-colors duration-200"
                >
                  {sub}
                </a>
              ))}
            </div>
          </div>
        ))}

        <Link href="/about-us" className="block py-3 px-2 border-b border-gray-100 hover:bg-gray-50">
          <span className="text-base font-medium text-gray-800">ABOUT US</span>
        </Link>

        {status === "authenticated" ? (
          <button 
            onClick={() => router.push("/logoutsecurity")}
            className="w-full text-left py-3 px-2 border-b border-gray-100 hover:bg-gray-50"
          >
            <span className="flex items-center text-red-500 font-medium"><FiUser className="mr-2" />Logout</span>
          </button>
        ) : (
          <button 
            onClick={() => signIn()}
            className="w-full text-left py-3 px-2 border-b border-gray-100 hover:bg-gray-50"
          >
            <span className="flex items-center text-blue-600 font-medium"><FiUser className="mr-2" />Login</span>
          </button>
        )}
        
        <Link href="/wishlist" className="block py-3 px-2 border-b border-gray-100 hover:bg-gray-50">
          <span className="flex items-center text-gray-800 font-medium"><FiHeart className="mr-2" />My Wish List</span>
        </Link>
      </nav>
    </div>
  </div>

  {/* ✅ Newsletter Popup Component */}
  <Newsletter isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} />
</>


);
};

export default Navbar;
