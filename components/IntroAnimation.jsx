"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const IntroAnimation = () => {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Check if the user has visited before using localStorage
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited) {
      setShowIntro(false); // Skip the intro if they've already been here
    } else {
      // Set a timer to hide the intro after the animation completes
      const timer = setTimeout(() => {
        setShowIntro(false);
        localStorage.setItem('hasVisited', 'true'); // Store in localStorage
      }, 5000); // Adjust this duration to match your GIF's length

      return () => clearTimeout(timer); // Clean up the timer
    }
  }, []);

  if (!showIntro) {
    return null; // Don't render if we're not showing the intro
  }

  return (
    <div className="fixed inset-0 z-[999] bg-white flex items-center justify-center">
      <Image
        src="./sb.gif" 
        alt="Intro animation"
        width={500}
        height={500}
        unoptimized={true} // GIFs are not optimized, so this prevents errors
      />
    </div>
  );
};

export default IntroAnimation;