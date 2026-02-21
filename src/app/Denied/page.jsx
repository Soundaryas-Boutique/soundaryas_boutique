"use client";

import React from "react";
import { FiLock } from "react-icons/fi";
import Link from "next/link";

const DeniedPage = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center silk-bg relative overflow-hidden font-main">
      {/* Decorative Brand Borders */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-60"></div>

      <div className="max-w-xl w-full mx-auto px-8 py-16 text-center relative z-10">
        {/* Shield Icon with Traditional Motif */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6 opacity-80">
            <div className="w-16 h-16 border border-secondary/30 rotate-45 flex items-center justify-center">
              <FiLock className="w-6 h-6 text-primary -rotate-45" />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-8 bg-secondary/30"></div>
            <div className="w-1.5 h-1.5 rounded-full border border-secondary/50"></div>
            <div className="h-[1px] w-8 bg-secondary/30"></div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-secondary text-primary mb-4 tracking-widest uppercase">
          Access Restricted
        </h1>

        <p className="text-grey-medium mb-12 max-w-sm mx-auto italic tracking-wide text-sm leading-relaxed">
          "You are not authorized to access this page."
        </p>

        {/* Minimalist Link Back */}
        <Link 
          href="/"
          className="text-[10px] uppercase tracking-[0.3em] font-bold text-secondary hover:text-primary transition-colors duration-300 pb-1 border-b border-secondary/20 hover:border-primary/40"
        >
          Return to Curation
        </Link>
      </div>

      {/* Atmospheric Background Elements */}
      <div className="absolute top-[15%] left-[10%] w-48 h-48 bg-secondary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[15%] right-[10%] w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
    </div>
  );
};

export default DeniedPage;
