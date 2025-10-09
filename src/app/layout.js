import "./globals.css";


import AuthProvider from "../../components/AuthProvider";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context//WishlistContext";
import NavbarWrapper from "../../components/NavbarWrapper";
import IntroAnimation from "../../components/IntroAnimation";

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
          <body className={` min-h-screen bg-white text-black font-main`}>
            <IntroAnimation />
            <NavbarWrapper />
            <div className="min-h-screen">
              {children}
            </div>
          </body>
        </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </html>
  );
}