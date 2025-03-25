import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  const publicRoutes = ["/", "/login(.*)", "/track(.*)", "/main(.*)"]; // ✅ Fixed regex

  console.log("Incoming Request Path:", req.nextUrl.pathname);

  if (!publicRoutes.some(route => req.nextUrl.pathname.match(new RegExp(`^${route}$`)))) {
    const authObj = await auth();
    console.log("Auth Object:", authObj); // Debugging step

    if (!authObj.userId) {
      return Response.redirect(new URL('/login', req.url));
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};