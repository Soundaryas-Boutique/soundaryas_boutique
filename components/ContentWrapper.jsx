"use client";

import { usePathname } from "next/navigation";

export default function ContentWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className={`min-h-screen ${isAdmin ? "" : "pt-[110px] lg:pt-[160px]"}`}>
      {children}
    </div>
  );
}
