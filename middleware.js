import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth?.token?.role;

    if (process.env.NODE_ENV === "development") {
      console.log("Path:", pathname, "Role:", role);
    }

    // Protect /admin routes → Admins only
    if (pathname.startsWith("/admin") && role !== "Admin") {
      return NextResponse.redirect(new URL("/Denied", req.url));
      // Or: return NextResponse.redirect(new URL("/login?callbackUrl=" + pathname, req.url));
    }

    // Protect /cart routes → Users only
    if (pathname.startsWith("/cart") && role !== "user") {
      return NextResponse.redirect(new URL("/Denied", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // only run middleware if logged in
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/cart/:path*"],
};
