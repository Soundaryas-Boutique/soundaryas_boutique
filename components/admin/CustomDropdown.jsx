"use client";
import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const CustomDropdown = ({ options, value, onChange, placeholder, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 flex items-center justify-between border border-gray-300 rounded-lg shadow-sm bg-white cursor-pointer transition-colors duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] focus:outline-none"
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <FiChevronDown 
          className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <ul className="absolute top-full left-0 right-0 mt-2 z-10 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className="p-3 cursor-pointer transition-colors duration-200 hover:bg-red-50 text-gray-800"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;