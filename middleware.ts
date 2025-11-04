import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/home",
  "/projects",
  "/billing",
  "/credits",
  "/help",
  "/settings",
  "/startup/(.*)",
  "/agents"
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // If user is not signed in and trying to access protected routes
  if (!userId && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If user is signed in and trying to access the root page
  if (userId && pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Allow the request to continue
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
