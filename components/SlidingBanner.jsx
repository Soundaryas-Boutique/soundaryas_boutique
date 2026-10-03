"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// alt carries the promotional text, since these banners are the offer -- a
// screen reader user would otherwise miss the sale entirely.
const slides = [
  {
    id: 1,
    image: '/slider_images/banner_1.webp',
    mobileImage: '/slider_images/banner_1_mobile.webp',
    alt: 'Aadi Sale: Mayuri Soft Silk sarees. From looms to legends, never goes out of style.',
  },
  {
    id: 2,
    image: '/slider_images/banner_2.webp',
    mobileImage: '/slider_images/banner_2_mobile.webp',
    alt: 'Free international shipping, and free domestic delivery on orders above Rs. 30,000. Terms apply; not available for packages over 10 kg.',
  },
  {
    id: 3,
    image: '/slider_images/banner_3.webp',
    mobileImage: '/slider_images/banner_3_mobile.webp',
    alt: 'Chiffon saree collection, starting from Rs. 700.',
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

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  }, 5000); // 6 seconds

  return () => clearInterval(interval);
}, []); // Always empty array so hook shape stays the same


  return (
    <div className="relative w-full mx-auto">
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-[1000ms] ease-in-out" // 1s animation
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={slide.id} className="flex-shrink-0 w-full">
              {/* Mobile Image. Intrinsic dimensions are passed so the browser
                  reserves the right box before the file arrives -- the previous
                  bare <img> with h-auto shifted the whole page on load. */}
              <Image
                src={slide.mobileImage}
                alt={slide.alt}
                width={1200}
                height={1600}
                sizes="100vw"
                /* Only the first slide is the LCP candidate; preloading all
                   three would fetch six images before anything renders. */
                priority={index === 0}
                className="w-full h-auto object-cover md:hidden"
              />
              {/* Desktop Image */}
              <Image
                src={slide.image}
                alt={slide.alt}
                width={2000}
                height={714}
                sizes="100vw"
                priority={index === 0}
                className="hidden w-full h-auto object-cover md:block"
              />
            </div>
          ))}
        </div>
        
        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-4 z-30">
          <button onClick={prevSlide} className="flex items-center justify-center p-2 group focus:outline-none">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60">
              <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" viewBox="0 0 6 10" fill="none">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>
          
          <button onClick={nextSlide} className="flex items-center justify-center p-2 group focus:outline-none">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60">
              <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" viewBox="0 0 6 10" fill="none">
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
