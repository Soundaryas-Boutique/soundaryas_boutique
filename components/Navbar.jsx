"use client";
import React, { useState, useRef, useEffect } from "react";
import { 
  FiUser, 
  FiHeart, 
  FiShoppingCart, 
  FiMenu, 
  FiMail,
  FiX,
  FiChevronDown, 
  FiSearch
} from "react-icons/fi";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import NewsletterPopup from "./NewsletterPopup";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const timeoutRef = useRef(null);

  // Categories with subcategories for luxury dropdowns
  const categories = [
    { 
      name: "Silk Sarees", 
      slug: "silk-sarees",
      subcategories: ["Kanchipuram Silk", "Banarasi Silk", "Mysore Silk", "Designer Silk", "Traditional Borders"] 
    },
    { 
      name: "Cotton Sarees", 
      slug: "cotton-sarees",
      subcategories: ["Chanderi Cotton", "Gadwal Cotton", "Printed Cotton", "Casual Wear"] 
    },
    { 
      name: "Collections", 
      slug: "collections",
      subcategories: ["Bridal Special", "Party Wear", "New Arrivals", "Best Sellers"] 
    },
    { 
      name: "Boutique", 
      slug: "boutique",
      subcategories: ["Our Story", "Craftsmanship", "Custom Orders", "Visit Us"] 
    },
  ];

  // Handle sticky navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategoryEnter = (index) => {
    clearTimeout(timeoutRef.current);
    setActiveDropdown(index);
  };

  const handleCategoryLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = newState ? "hidden" : "unset";
    }
  };

  return (
    <>
      <header className="w-full z-[100] fixed top-0 left-0 bg-white">
        {/* Tier 1: Announcement Bar */}
        <div className="bg-primary text-ivory py-1.5 px-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] font-medium">
            Free Shipping on Orders Over ₹5000 • Handcrafted with Love 
          </p>
        </div>

        {/* Tier 2: Main Branding & Utilities */}
        <div className="w-full bg-white border-b border-gray-50 py-3 lg:py-4">
          <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between">
            
            {/* Left: Search (Desktop) / Menu (Mobile) */}
            <div className="flex-1 flex items-center">
              <button className="lg:hidden text-primary p-2" onClick={toggleMobileMenu}>
                <FiMenu className="w-6 h-6" />
              </button>
              <div className="hidden lg:flex items-center gap-2 group cursor-pointer text-grey-medium hover:text-primary transition-colors">
                <FiSearch className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest font-medium">Search</span>
              </div>
            </div>

            {/* Center: Branding */}
            <div className="flex-shrink-0 text-center">
              <Link href="/" className="inline-block group">
                <h1 className="text-primary text-2xl lg:text-4xl font-secondary tracking-tight transition-transform duration-300 group-hover:scale-[1.02]">
                  Soundarya&apos;s
                </h1>
                <p className="text-secondary text-[9px] lg:text-[10px] uppercase tracking-[0.5em] font-medium -mt-1 lg:-mt-1.5">
                  Boutique
                </p>
              </Link>
            </div>

            {/* Right: Utilities */}
            <div className="flex-1 flex items-center justify-end gap-5 lg:gap-8 text-primary">
              <Link href="/Profile" className="group relative hidden lg:block">
                <FiUser className="w-5 h-5 transition-colors group-hover:text-black" />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Link>
              
              <Link href="/Wishlist" className="group relative">
                <FiHeart className="w-5 h-5 transition-colors group-hover:text-black" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-secondary text-[8px] text-white font-bold">0</span>
              </Link>

              <button onClick={() => setIsPopupOpen(true)} className="group relative hidden lg:block">
                <FiMail className="w-5 h-5 transition-colors group-hover:text-black" />
              </button>

              <Link href="/Cart" className="group relative">
                <FiShoppingCart className="w-5 h-5 transition-colors group-hover:text-black" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[8px] text-white font-bold">0</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tier 3: Category Navigation (Desktop) */}
        <nav className="hidden lg:block w-full bg-white/95 backdrop-blur-md py-2 border-b border-gray-100 shadow-sm">
          <div className="max-w-[1440px] mx-auto flex justify-center items-center gap-12">
            {categories.map((category, idx) => (
              <div 
                key={idx} 
                className="relative group h-full"
                onMouseEnter={() => handleCategoryEnter(idx)}
                onMouseLeave={handleCategoryLeave}
              >
                <Link 
                  href={`/collections/${category.slug}`}
                  className="text-[11px] uppercase tracking-[0.25em] font-medium text-grey-dark hover:text-primary transition-colors py-2 block"
                >
                  {category.name}
                </Link>
                
                {/* Underline Animation */}
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-secondary transition-transform duration-500 origin-left ${
                  activeDropdown === idx ? 'scale-x-100' : 'scale-x-0'
                }`} />

                {/* Refined Dropdown */}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 w-64 silk-bg border border-gray-100 shadow-premium transition-all duration-300 transform origin-top ${
                  activeDropdown === idx ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible'
                }`}>
                  <div className="p-6 grid gap-4">
                    {category.subcategories.map((sub, sIdx) => (
                      <Link 
                        key={sIdx} 
                        href="#" 
                        className="text-[10px] uppercase tracking-widest text-grey-medium hover:text-primary hover:translate-x-1 transition-all"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Drawer */}
      <div className={`fixed inset-0 z-[150] lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={toggleMobileMenu} />
        
        {/* Content */}
        <div className={`absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} traditional-border`}>
          <div className="p-8 flex flex-col h-full">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-secondary text-primary">Menu</h2>
              <button 
                className="p-2 -mr-2 text-primary"
                onClick={toggleMobileMenu}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
              <Link href="/" onClick={toggleMobileMenu} className="block py-4 text-[12px] uppercase tracking-[0.2em] font-semibold text-primary border-b border-gray-50">
                Home
              </Link>
              
              {categories.map((category, idx) => (
                <div key={idx} className="border-b border-gray-50">
                  <button 
                    className="w-full flex justify-between items-center py-5 group"
                    onClick={() => setActiveMobileCategory(activeMobileCategory === idx ? null : idx)}
                  >
                    <span className="text-[12px] uppercase tracking-[0.2em] font-semibold text-grey-dark group-hover:text-primary transition-colors">
                      {category.name}
                    </span>
                    <FiChevronDown className={`w-4 h-4 text-primary transition-transform duration-300 ${activeMobileCategory === idx ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    activeMobileCategory === idx ? 'max-h-[400px] mb-4' : 'max-h-0'
                  }`}>
                    <div className="pl-4 space-y-4 pt-2">
                      {category.subcategories.map((sub, sIdx) => (
                        <Link 
                          key={sIdx} 
                          href="#" 
                          onClick={toggleMobileMenu}
                          className="block text-[11px] uppercase tracking-widest text-grey-medium hover:text-primary"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <Link href="/about-us" onClick={toggleMobileMenu} className="block py-5 text-[12px] uppercase tracking-[0.2em] font-semibold text-grey-dark border-b border-gray-50">
                Our Story
              </Link>
            </nav>

            <div className="mt-auto pt-8 border-t border-gray-100 flex flex-col gap-4">
              {status === "authenticated" ? (
                <button 
                  onClick={() => { signOut(); toggleMobileMenu(); }}
                  className="btn-primary w-full !py-4"
                >
                  Logout
                </button>
              ) : (
                <button 
                  onClick={() => { signIn(); toggleMobileMenu(); }}
                  className="btn-primary w-full !py-4"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <NewsletterPopup
        isPopupOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen}
      />
    </>
  );
};

export default Navbar;