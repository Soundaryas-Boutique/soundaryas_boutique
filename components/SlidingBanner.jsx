'use client'

import React, { useState } from 'react';
import Image from 'next/image';

const images = [
  '/images/banner1.jpg',
  '/images/banner2.jpg',
  '/images/banner3.jpg',
];

const SlidingBanner = () => {
  const [current, setCurrent] = useState(0);
  const length = images.length;

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)`, width: `${length * 100}%` }}
      >
        {images.map((src, index) => (
          <div key={index} className="w-full flex-shrink-0 h-screen relative">
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              layout="fill"
              objectFit="cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-6 transform -translate-y-1/2 text-white text-4xl bg-black/30 px-3 py-1 rounded-full hover:bg-black/60 z-10"
      >
        ‹
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-6 transform -translate-y-1/2 text-white text-4xl bg-black/30 px-3 py-1 rounded-full hover:bg-black/60 z-10"
      >
        ›
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-4 h-4 rounded-full ${
              current === index ? 'bg-white' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>

      {/* Optional Overlay (e.g., heading/text) */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-white bg-black/30 z-0">
        {/* <h1 className="text-5xl font-bold">Welcome</h1> */}
      </div>
    </div>
  );
};

export default SlidingBanner;
