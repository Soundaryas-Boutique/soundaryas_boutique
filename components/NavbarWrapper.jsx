"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname(); // get current path

  // Hide navbar if the route starts with /admin
  if (pathname.startsWith("/admin")) return null;

  return <Navbar />;
}
