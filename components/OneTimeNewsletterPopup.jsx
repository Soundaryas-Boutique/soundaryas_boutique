"use client";
import React, { useState, useEffect } from 'react';
import Newsletter from './Newsletter'; // The main form component

const OneTimeNewsletterPopup = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    // Check if the user has visited in this session
    const visited = sessionStorage.getItem('hasVisited');
    if (!visited) {
      // If it's the first visit, open the popup after a small delay
      const timer = setTimeout(() => {
        setIsPopupOpen(true);
        document.body.classList.add("overflow-hidden");
      }, 2000); // Popup appears after 2 seconds

      // Mark the session as visited so the popup doesn't reappear
      sessionStorage.setItem('hasVisited', 'true');

      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsPopupOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  return (
    <Newsletter
      isPopupOpen={isPopupOpen}
      setIsPopupOpen={closePopup} // Pass a function to close the popup
      isSubscriptionOpen={false} // Set these to false
      setIsSubscriptionOpen={() => {}}
      subscriptions={[]}
      setSubscriptions={() => {}}
    />
  );
};

export default OneTimeNewsletterPopup;