import React from 'react';
import { FiUser, FiHeart, FiShoppingCart } from 'react-icons/fi';

const Navbar = () => {
  return (
    <>
      {/* Top Bar (non-sticky) */}
      <div className="w-full shadow-sm border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-[#8B0000] text-xl tracking-wide font-semibold">Soundarya's Boutique</div>
          <div className="flex gap-6 items-center text-[#8B0000]">
            <FiUser className="w-5 h-5 cursor-pointer" />
            <FiHeart className="w-5 h-5 cursor-pointer" />
            <FiShoppingCart className="w-5 h-5 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Category Bar (sticky) */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 py-2 flex justify-center gap-5 text-[#A52A2A] font-medium">
          <a href="#">Silk Sarees</a>
          <a href="#">Cotton Sarees</a>
          <a href="#">Kanchipuram</a>
          <a href="#">Banarasi</a>
          <a href="#">Bridal</a>
          <a href="#">Daily Wear</a>
          <a href="#">Collections</a>
          <a href="#">Offers</a>
          <a href="#">New Arrivals</a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
