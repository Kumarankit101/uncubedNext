import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/signup(.*)',
  '/privacy',
  '/terms',
  '/shared/result/(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

const isProtectedRoute = createRouteMatcher([
  '/home(.*)',
  '/dashboard(.*)',
  '/projects(.*)',
  '/agents(.*)',
  '/startup(.*)',
  '/billing(.*)',
  '/credits(.*)',
  '/settings(.*)',
  '/help(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { protect } = await auth();
    await protect();
  }
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
