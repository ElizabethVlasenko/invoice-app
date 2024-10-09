import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isProtected = createRouteMatcher([
//   "/dashboard",
//   "/invoices/:invoiceId",
//   "invoice/new",
// ]);

const isPublic = createRouteMatcher(["/"]);

export default clerkMiddleware((auth, request) => {
  //check if the route should be protected
  if (!isPublic(request)) {
    //check if the user is authenticated
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
