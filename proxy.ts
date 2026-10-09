import { NextResponse, type NextRequest } from "next/server";
import { contentSecurityPolicy, NONCE_HEADER } from "@/lib/csp";
import {
  ADMIN_PATH,
  ADMIN_SESSION_COOKIE,
  GOOGLE_NONCE_COOKIE,
  GOOGLE_NONCE_HEADER,
  GOOGLE_NONCE_MAX_AGE_SECONDS,
  SESSION_COOKIE,
} from "@/lib/session-cookie";

const ADMIN_LOGIN = `${ADMIN_PATH}/login`;

/**
 * Pages reachable without signing in: the home page, the captcha pages, the docs, the pages about
 * the service and the sign-in pages. /privacy and /terms redirect to /legal before the proxy runs.
 */
const publicPaths = [
  "/captchas",
  "/docs",
  "/pricing",
  "/legal",
  "/status",
  "/status.json",
  "/about",
  "/security",
  "/changelog",
  "/.well-known",
  "/login",
  "/session-expired",
  "/demo",
  ADMIN_LOGIN,
  `${ADMIN_PATH}/session-expired`,
];

/**
 * Optimistic gate: visitors with no session cookie never reach a dashboard page, and those
 * with no administrator session never reach the admin console, which has its own sign-in.
 * Whether a token is still valid is decided by the data layer on the server. Every page also
 * gets a Content-Security-Policy with a nonce of its own, which Next puts on its scripts.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const nonce = newNonce();
  const policy = contentSecurityPolicy(nonce, servedOverHttps(request));
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(NONCE_HEADER, nonce);
  requestHeaders.set("Content-Security-Policy", policy);

  let response: NextResponse;
  if (pathname === "/login" || pathname === ADMIN_LOGIN) {
    response = withGoogleNonce(request, requestHeaders);
  } else if (pathname === "/" || publicPaths.some((path) => pathname === path || pathname.startsWith(path + "/"))) {
    response = NextResponse.next({ request: { headers: requestHeaders } });
  } else if (request.cookies.has(isAdminPath(pathname) ? ADMIN_SESSION_COOKIE : SESSION_COOKIE)) {
    response = NextResponse.next({ request: { headers: requestHeaders } });
  } else {
    const login = new URL(isAdminPath(pathname) ? ADMIN_LOGIN : "/login", request.url);
    if (pathname !== ADMIN_PATH) login.searchParams.set("next", pathname + search);
    response = NextResponse.redirect(login);
  }
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

function isAdminPath(pathname: string): boolean {
  return pathname === ADMIN_PATH || pathname.startsWith(ADMIN_PATH + "/");
}

/** Behind Traefik the request arrives over plain HTTP with X-Forwarded-Proto: https. */
function servedOverHttps(request: NextRequest): boolean {
  return request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
}

/**
 * Makes sure the sign-in page, and the sign-in action posted to it, have a Google nonce.
 * An existing one is kept so several open tabs share it.
 */
function withGoogleNonce(request: NextRequest, requestHeaders: Headers) {
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
  matcher: [
    {
      // Every page; static files and images need no policy. Prefetches of next/link skip the proxy,
      // as the Next.js CSP guide advises: the pages behind the gate check the session themselves.
      source: "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
