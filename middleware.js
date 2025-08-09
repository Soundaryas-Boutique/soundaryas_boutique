import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log("Path:", req.nextUrl.pathname);
    console.log("Token:", req.nextauth.token);

    // Example role protection for other routes
    if (
      req.nextUrl.pathname.startsWith("/ClientMember") &&
      req.nextauth.token?.role !== "Admin"
    ) {
      return NextResponse.rewrite(new URL("/Denied", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // all matched routes require auth
    },
  }
);

export const config = {
  matcher: [
    "/ClientMember",
    "/Member", // keep your protected pages here
  ],
};
