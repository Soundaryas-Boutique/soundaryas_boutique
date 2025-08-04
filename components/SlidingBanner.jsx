'use client'

import React, { useState, useEffect } from "react";

import Image from "next/image";
import { useSwipeable } from "react-swipeable";

const SlidingBanner = () => {
  const sliderData = [
    {
      id: 1,
      title: "Experience Pure Sound - Your Perfect Headphones Awaits!",
      offer: "Limited Time Offer 30% Off",
      buttonText1: "Buy now",
      buttonText2: "Find more",
      link: "",

    },
    {
      id: 2,
      title: "Next-Level Gaming Starts Here - Discover PlayStation 5 Today!",
      offer: "Hurry up only few lefts!",
      buttonText1: "Shop Now",
      buttonText2: "Explore Deals",
      link: "",
   
    },
    {
      id: 3,
      title: "Power Meets Elegance - Apple MacBook Pro is Here for you!",
      offer: "Exclusive Deal 40% Off",
      buttonText1: "Order Now",
      buttonText2: "Learn More",
      link: "",

    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const autoSlideDelay = 5000;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, autoSlideDelay);

    return () => clearTimeout(timeout);
  }, [currentSlide, sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentSlide((prev) => (prev + 1) % sliderData.length),
    onSwipedRight: () =>
      setCurrentSlide((prev) =>
        prev === 0 ? sliderData.length - 1 : prev - 1
      ),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div {...handlers} className="relative max-w-9xl overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="flex flex-col-reverse min-h-full md:flex-row items-center justify-between min-w-full"
          >
            <div className="flex items-center flex-1 justify-center w-full">
              <Image
                draggable={false}
                className="block md:hidden w-full object-contain shadow-2xl"
                src={slide.imgMobileSrc || slide.imgSrc}
                alt={`Slide ${index + 1} Mobile`}
              />
              <Image
                draggable={false}
                className="hidden md:block w-full object-contain shadow-2xl"
                src={slide.imgSrc}
                alt={`Slide ${index + 1} Desktop`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-end justify-center gap-2 mt-8 relative -top-44 -left-10">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-4 w-4  cursor-pointer ${currentSlide === index ? "bg-gray-700" : "bg-gray-700/30"
              }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default SlidingBanner;
