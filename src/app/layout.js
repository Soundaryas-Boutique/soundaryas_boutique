import "./globals.css";
import Navbar from "../../components/Navbar";

export const metadata = {
  title: "Soundarya's Boutique",
  description: "E-Commerce Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
