import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log("Path:", req.nextUrl.pathname);
    console.log("Token:", req.nextauth?.token);

    // Protect /admin routes for Admins only
    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextauth?.token?.role !== "Admin"
    ) {
      return NextResponse.redirect(new URL("/Denied", req.url));
    }

    // Protect /cart routes for Users only
    if (
      req.nextUrl.pathname.startsWith("/cart") &&
      req.nextauth?.token?.role !== "User"
    ) {
      return NextResponse.redirect(new URL("/Denied", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, 
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/cart/:path*"], 
};
