import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

import {
  ADMIN_LOGIN_REDIRECT,
  adminPrefix,
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  userDashboard,
} from "./routes";

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoutes = nextUrl.pathname.startsWith(apiAuthPrefix);
  // const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoutes = authRoutes.includes(nextUrl.pathname);
  const isAdminRoutes = nextUrl.pathname.startsWith(adminPrefix);
  const isUserDashboard = nextUrl.pathname.startsWith(userDashboard);

  if (isApiAuthRoutes) {
    return NextResponse.next();
  }

  if (isAuthRoutes) {
    if (isLoggedIn) {
      if (req.auth?.user?.role === "ADMIN") {
        return NextResponse.redirect(new URL(ADMIN_LOGIN_REDIRECT, nextUrl));
      }
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return NextResponse.next();
  }

  if (isUserDashboard) {
    if (isLoggedIn) {
      return NextResponse.next();
    }
    const loginUrl = new URL(DEFAULT_LOGIN_REDIRECT, nextUrl);
    loginUrl.searchParams.set("redirect", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoutes) {
    if (isLoggedIn && req.auth?.user?.role === "ADMIN") {
      return NextResponse.next();
    }
    const loginUrl = new URL(DEFAULT_LOGIN_REDIRECT, nextUrl);
    loginUrl.searchParams.set("redirect", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // if (!isLoggedIn && !isPublicRoutes) {
  //   return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  // }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
