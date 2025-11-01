import { clerkMiddleware } from '@clerk/nextjs/server';

// Middleware temporarily disabled due to Next.js 16 Clerk compatibility issue
// TODO: Re-enable Clerk protection after fixing headers compatibility
export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
