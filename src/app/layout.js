import "./globals.css";

import AuthProvider from "../../components/AuthProvider";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import NavbarWrapper from "../../components/NavbarWrapper";
import ContentWrapper from "../../components/ContentWrapper";
import IntroAnimation from "../../components/IntroAnimation";
import OneTimeNewsletterPopup from "../../components/OneTimeNewsletterPopup";
import Footer from "../../components/Footer";
import { Poppins, Yeseva_One } from "next/font/google";

// Poppins for body text
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

// Yeseva One for headings
const yeseva = Yeseva_One({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-yeseva",
});

export const metadata = {
  title: "Soundarya's Boutique",
  description: "E-Commerce Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <body className={`${poppins.variable} ${yeseva.variable} min-h-screen bg-white text-black font-main`}>
              <IntroAnimation />
              {/* ✅ Render the popup here */}
              <NavbarWrapper />
              <ContentWrapper>
                {children}
              </ContentWrapper>
            </body>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </html>
  );
}
