import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_PATH,
  ADMIN_SESSION_COOKIE,
  GOOGLE_NONCE_COOKIE,
  GOOGLE_NONCE_HEADER,
  GOOGLE_NONCE_MAX_AGE_SECONDS,
  SESSION_COOKIE,
} from "@/lib/session-cookie";

const ADMIN_LOGIN = `${ADMIN_PATH}/login`;

/** Pages reachable without signing in: the home page, the docs and the sign-in pages. */
const publicPaths = ["/docs", "/login", "/session-expired", "/demo", ADMIN_LOGIN, `${ADMIN_PATH}/session-expired`];

/**
 * Optimistic gate: visitors with no session cookie never reach a dashboard page, and those
 * with no administrator session never reach the admin console, which has its own sign-in.
 * Whether a token is still valid is decided by the data layer on the server.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/login" || pathname === ADMIN_LOGIN) {
    return withGoogleNonce(request);
  }
  if (pathname === "/" || publicPaths.some((path) => pathname === path || pathname.startsWith(path + "/"))) {
    return NextResponse.next();
  }
  const admin = pathname === ADMIN_PATH || pathname.startsWith(ADMIN_PATH + "/");
  if (request.cookies.has(admin ? ADMIN_SESSION_COOKIE : SESSION_COOKIE)) {
    return NextResponse.next();
  }

  const login = new URL(admin ? ADMIN_LOGIN : "/login", request.url);
  if (pathname !== ADMIN_PATH) login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

/**
 * Makes sure the sign-in page, and the sign-in action posted to it, have a Google nonce.
 * An existing one is kept so several open tabs share it.
 */
function withGoogleNonce(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  // Only the proxy may set this header.
  requestHeaders.delete(GOOGLE_NONCE_HEADER);
  if (request.cookies.get(GOOGLE_NONCE_COOKIE)?.value) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const nonce = newNonce();
  requestHeaders.set(GOOGLE_NONCE_HEADER, nonce);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.cookies.set(GOOGLE_NONCE_COOKIE, nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GOOGLE_NONCE_MAX_AGE_SECONDS,
  });
  return response;
}

/** 256 random bits, base64url. */
function newNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
