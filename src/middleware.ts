import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const pathname = req.nextUrl.pathname;

    const isAuthPage = pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");
    const isProtectedPage = pathname.startsWith("/dashboard");

    if (isAuthPage) {
      if (isAuth) {
        const from = req.nextUrl.searchParams.get("from") || "/";
        return NextResponse.redirect(new URL(from, req.url));
      }
      return NextResponse.next();
    }

    if (isProtectedPage && !isAuth) {
      let from = pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      return NextResponse.redirect(
        new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
  ],
};
