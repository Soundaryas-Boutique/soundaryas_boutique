"use client"
import React, { useState } from 'react';

const slides = [
  { 
    id: 1, 
    image: '/slider_images/banner_1.webp',
    mobileImage: '/slider_images/banner_1_mobile.webp' 
  },
  { 
    id: 2, 
    image: '/slider_images/banner_2.webp',
    mobileImage: '/slider_images/banner_2_mobile.webp' 
  },
  { 
    id: 3, 
    image: '/slider_images/banner_3.webp',
    mobileImage: '/slider_images/banner_3_mobile.webp' 
  },
];

const SlidingBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full mx-auto">
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="flex-shrink-0 w-full">
              {/* Mobile Image (hidden on desktop) */}
              <img 
                src={slide.mobileImage} 
                alt={`Mobile Slide ${slide.id}`} 
                className="w-full h-auto object-cover md:hidden"
              />
              {/* Desktop Image (hidden on mobile) */}
              <img 
                src={slide.image} 
                alt={`Slide ${slide.id}`} 
                className="hidden w-full h-auto object-cover md:block"
              />
            </div>
          ))}
        </div>
        
        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-4 z-30">
          <button 
            onClick={prevSlide} 
            type="button" 
            className="flex items-center justify-center p-2 group focus:outline-none"
            data-carousel-prev
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60">
              <svg 
                className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" 
                aria-hidden="true" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 6 10"
              >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>
          
          <button 
            onClick={nextSlide} 
            type="button" 
            className="flex items-center justify-center p-2 group focus:outline-none"
            data-carousel-next
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60">
              <svg 
                className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" 
                aria-hidden="true" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 6 10"
              >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <span className="sr-only">Next</span>
            </span>
          </button>
        </div>
      </div>
      
      {/* Dots Indicator */}
      <div className="flex justify-center mt-4">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 mx-1 rounded-full ${
              index === currentSlide ? 'bg-gray-800/60' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default SlidingBanner;
