import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "./lib/auth-server";

export async function proxy(request: NextRequest) {
  if (!(await isAuthenticated())) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding"],
};
