import "./globals.css";
import { Cinzel } from 'next/font/google';
import Navbar from "../../components/Navbar";
import AuthProvider from "../../components/AuthProvider";

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Cinzel supports multiple weights
  variable: '--font-cinzel',
});

export const metadata = {
  title: "Soundarya's Boutique",
  description: "E-Commerce Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
      <body className={`${cinzel.variable} min-h-screen bg-white text-black font-main`}>
        <Navbar />
        {children}
      </body>
      </AuthProvider>
    </html>
  );
}
