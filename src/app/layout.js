import "./globals.css"; // 👈 Add this line back

import { Cinzel, Noto_Sans } from 'next/font/google';
import AuthProvider from "../../components/AuthProvider";
import { CartProvider } from "./context/CartContext";
import NavbarWrapper from "../../components/NavbarWrapper";
import IntroAnimation from "../../components/IntroAnimation"; 

// ... (font declarations and metadata)

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <CartProvider>
          <body>
            <IntroAnimation />
            <NavbarWrapper />
            <div className="min-h-screen">
              {children}
            </div>
          </body>
        </CartProvider>
      </AuthProvider>
    </html>
  );
}