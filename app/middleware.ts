import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  const publicRoutes = ["/", "/login(.*)", "/track(.*)", "/(main)/(.*)"];
  
  if (!publicRoutes.some(route => req.nextUrl.pathname.match(route))) {
    const authObj = await auth();
    if (!authObj.userId) {
      return Response.redirect(new URL('/login', req.url));
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
