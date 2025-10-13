"use client";
import React from 'react';
import { FiX } from "react-icons/fi";
import Newsletter from "./Newsletter";

const NewsletterPopup = ({ isPopupOpen, setIsPopupOpen }) => {
  if (!isPopupOpen) return null;

  const closePopup = () => {
    setIsPopupOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  return (
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
        <Newsletter onClose={closePopup} />
      </div>
    </div>
  );
};

export default NewsletterPopup;