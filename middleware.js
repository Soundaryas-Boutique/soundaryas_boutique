import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log("Path:", req.nextUrl.pathname);
    console.log("Token:", req.nextauth?.token);

    if (
      req.nextUrl.pathname.startsWith("/Cart") &&
      req.nextauth?.token?.role !== "Admin"
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
  matcher: ["/Cart"],
};
