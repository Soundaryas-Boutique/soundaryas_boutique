"use client";

import { usePathname } from "next/navigation";

import Footer from "./Footer";

export default function ContentWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isDenied = pathname === "/Denied";

  return (
    <div className={`min-h-screen ${(isAdmin || isDenied) ? "" : "pt-[110px] lg:pt-[160px]"}`}>
      {children}
      {(!isAdmin && !isDenied) && <Footer />}
    </div>
  );
}
