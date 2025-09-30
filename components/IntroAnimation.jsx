"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

const IntroAnimation = () => {
  // Use a state variable to control the animation's visibility.
  const [showIntro, setShowIntro] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    // Check if the user has visited in this session
    const hasVisited = sessionStorage.getItem('hasVisited');

    if (!hasVisited) {
      // If it's the first visit, show the intro and set a timer.
      setShowIntro(true);

      const timer = setTimeout(() => {
        setShowIntro(false);
        // Mark the session as visited.
        sessionStorage.setItem('hasVisited', 'true');
      }, 2500); // 5 seconds

      return () => clearTimeout(timer); // Clean up the timer.
    } else {
      // If the user has visited before, hide the intro immediately.
      setShowIntro(false);
    }
  }, []);

  if (!showIntro) {
    return null; // Don't render the animation if it's not the first visit.
  }

  return (
    <div className="fixed inset-0 z-[999] bg-white flex items-center justify-center">
      <Image
        src="/sb.gif"
        alt="Intro animation"
        width={500}
        height={500}
        unoptimized={true}
      />
    </div>
  );
};

export default IntroAnimation;