"use client";

import React from "react";
import Link from "next/link";
import { 
  FiInstagram, 
  FiFacebook, 
  FiTwitter, 
  FiChevronRight,
  FiMapPin,
  FiPhone,
  FiMail
} from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-grey-light border-t border-ivory pt-20 pb-10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Top Section: Brand & Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* Column 1: Brand Story */}
          <div className="space-y-6">
            <div>
              <Link href="/" className="inline-block group">
                <h2 className="text-primary text-2xl lg:text-3xl font-secondary tracking-tight">
                  Soundarya&apos;s
                </h2>
                <p className="text-secondary text-[9px] lg:text-[10px] uppercase tracking-[0.5em] font-medium -mt-1">
                  Boutique
                </p>
              </Link>
            </div>
            <p className="text-grey-medium text-sm font-main leading-relaxed italic pr-4">
              "Celebrating the timeless elegance of Indian heritage through handcrafted silk and the art of traditional weaving."
            </p>
            <div className="flex items-center gap-4 text-primary">
              <a href="#" className="hover:text-secondary transition-colors"><FiInstagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-secondary transition-colors"><FiFacebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-secondary transition-colors"><FiTwitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h3 className="text-primary font-secondary text-lg mb-8 uppercase tracking-widest">Collections</h3>
            <ul className="space-y-4">
              {["Kanchipuram Silk", "Banarasi Heritage", "Designer Lehengas", "Party Wear", "New Arrivals"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-grey-medium hover:text-primary transition-colors text-sm flex items-center group">
                    <FiChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: The Boutique */}
          <div>
            <h3 className="text-primary font-secondary text-lg mb-8 uppercase tracking-widest">The Boutique</h3>
            <ul className="space-y-4">
              {["Our Story", "Craftsmanship", "Sustainability", "Careers", "Visit Our Store"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-grey-medium hover:text-primary transition-colors text-sm flex items-center group">
                    <FiChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Info */}
          <div>
            <h3 className="text-primary font-secondary text-lg mb-8 uppercase tracking-widest">Connect</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 text-grey-medium text-sm">
                <FiMapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span>123 Silk Weaver Lane, <br />Heritage Quarter, TN 600001</span>
              </li>
              <li className="flex items-center gap-3 text-grey-medium text-sm">
                <FiPhone className="w-5 h-5 text-secondary flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-grey-medium text-sm">
                <FiMail className="w-5 h-5 text-secondary flex-shrink-0" />
                <span>care@soundaryas.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="relative h-px w-full bg-gradient-to-r from-transparent via-secondary/30 to-transparent mb-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-secondary/50 bg-grey-light"></div>
        </div>

        {/* Bottom Section: Legal & Trust */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-grey-medium text-[10px] uppercase tracking-[0.2em] font-medium order-2 md:order-1">
            © {currentYear} Soundarya&apos;s Boutique. All Rights Reserved.
          </div>
          
          <div className="flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-medium text-grey-medium order-1 md:order-2">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-primary transition-colors">Shipping & Returns</Link>
          </div>

          <div className="flex items-center gap-4 opacity-50 order-3 grayscale">
             <div className="text-[10px] uppercase tracking-widest border border-secondary/50 px-3 py-1 text-secondary font-bold">
               Handcrafted in India
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
