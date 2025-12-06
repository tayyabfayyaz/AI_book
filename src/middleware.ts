import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Corrected import

export const config = {
  matcher: ["/dashboard/:path*", "/book/:path*"], // Protect dashboard and book routes
};

export function middleware(req: NextRequest) {
  // Use better-auth middleware to protect routes
  return auth(req, { // Corrected usage
    publicRoutes: ["/auth/signin", "/auth/signup", "/"], // Allow access to sign-in, sign-up, and home
    loginPage: "/auth/signin",
  });
}
