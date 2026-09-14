import { clerkMiddleware } from '@clerk/nextjs/server';

// Auth checks live in the pages themselves (requireUser / requireAdmin in lib/auth.ts),
// as Clerk recommends; the middleware only establishes the session.
export default clerkMiddleware();

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)'],
};
