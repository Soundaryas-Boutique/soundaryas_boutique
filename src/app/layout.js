import "./globals.css";

import { Cinzel, Noto_Sans } from 'next/font/google';
import AuthProvider from "../../components/AuthProvider";
import { CartProvider } from "./context/CartContext";
import NavbarWrapper from "../../components/NavbarWrapper";
import IntroAnimation from "../../components/IntroAnimation";

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-cinzel' });
const noto = Noto_Sans({ subsets: ['latin'], weight: ['100','200','300','400','500','600','700'], variable: '--font-noto', display: 'swap' });

export const metadata = {
  title: "Soundarya's Boutique",
  description: "E-Commerce Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <CartProvider>
          <body className={`${cinzel.variable} ${noto.variable} min-h-screen bg-white text-black font-main`}>
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