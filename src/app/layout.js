import "./globals.css";
import { Cinzel, Noto_Sans } from 'next/font/google';
import Navbar from "../../components/Navbar";
import AuthProvider from "../../components/AuthProvider";

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel',
});

const noto = Noto_Sans({
  subsets: ['latin'],
  weight: ['100','200','300','400','500','600','700'], 
  variable: '--font-noto', 
  display: 'swap',
})

export const metadata = {
  title: "Soundarya's Boutique",
  description: "E-Commerce Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
      <body className={`${cinzel.variable} ${noto.variable} min-h-screen bg-white text-black font-main`}>
        <Navbar />
        {children}
      </body>
      </AuthProvider>
    </html>
  );
}
