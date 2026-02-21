"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname(); // get current path

  // Hide navbar if the route starts with /admin or is /Denied
  if (pathname.startsWith("/admin") || pathname === "/Denied") return null;

  return <Navbar />;
}
