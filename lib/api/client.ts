import "server-only";

import { headers } from "next/headers";
import { endAdminSession, endSession, getSessionToken, type SessionKind } from "@/lib/session";

/**
 * Public entry point of wau-services (the gateway). This server calls it for the dashboard;
 * the integration guide shows it to users for their own sites. It only comes from the
 * environment (.env), and is read per call so an edit applies once the server reloads it.
 */
export function servicesUrl(): string {
  const url = process.env.WAU_SERVICES_URL?.trim().replace(/\/+$/, "");
  if (!url) throw misconfigured("WAU_SERVICES_URL is not set");
  return url;
}

/** A failed call, carrying the Kratos error shape {code, reason, message, metadata}. */
export class ApiError extends Error {
  readonly status: number;
  readonly reason: string;
  readonly field?: string;

  constructor(status: number, reason: string, message: string, field?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.reason = reason;
    this.field = field;
  }
}

export type ApiFetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** Attach the session token (default true). If wau-services rejects it, the browser is signed out. */
  auth?: boolean;
  /** Whose session token to attach: the dashboard user's (default) or the administrator's. */
  session?: SessionKind;
  /**
   * Use this token instead of the cookie, e.g. right after signing in. Its rejection is thrown
   * to the caller rather than signing the browser out.
   */
  token?: string;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true, session = "user", token } = options;
  const base = servicesUrl();
  const requestHeaders = new Headers({ Accept: "application/json" });
  if (body !== undefined) requestHeaders.set("Content-Type", "application/json");

  const bearer = token ?? (auth ? await getSessionToken(session) : null);
  if (bearer) requestHeaders.set("Authorization", `Bearer ${bearer}`);

  const incoming = await headers();
  // Let the gateway rate limit the real visitor rather than this server.
  const clientIp = incoming.get("x-forwarded-for");
  if (clientIp) requestHeaders.set("X-Forwarded-For", clientIp);

  const host = incoming.get("host");
  if (host && sameHost(base, host)) {
    throw misconfigured(`WAU_SERVICES_URL=${base} is the address of this dashboard, not of wau-services`);
  }

  let response: Response;
  try {
    response = await fetch(base + path, {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      // The gateway answers every /v1 call itself; a redirect means this is another server.
      redirect: "manual",
    });
  } catch {
    throw new ApiError(0, "SERVICES_UNREACHABLE", `wau-services is unreachable at ${base}`);
  }

  if (response.status >= 300 && response.status < 400) {
    throw misconfigured(
      `WAU_SERVICES_URL=${base} redirected ${method} ${path} to ${response.headers.get("location")}`,
    );
  }

  const payload = await readJson(response);
  if (!payload) {
    throw misconfigured(`WAU_SERVICES_URL=${base} answered ${method} ${path} with ${response.status} and no JSON`);
  }

  // The session cookie no longer works. Callers that catch errors must rethrow this redirect.
  if (response.status === 401 && bearer && !token) return session === "admin" ? endAdminSession() : endSession();
  // An administrator banned the account: its session ends at once, and the login page says why.
  if (payload.reason === "ACCOUNT_BANNED" && bearer && !token && session === "user") return endSession("banned");

  if (!response.ok) {
    const metadata = (payload.metadata ?? {}) as Record<string, string>;
    throw new ApiError(
      response.status,
      typeof payload.reason === "string" ? payload.reason : "UNKNOWN",
      typeof payload.message === "string" ? payload.message : response.statusText,
      metadata.field,
    );
  }
  return payload as T;
}

function sameHost(base: string, host: string): boolean {
  try {
    return new URL(base).host === host;
  } catch {
    return false;
  }
}

/**
 * WAU_SERVICES_URL is missing or points at something that is not the gateway. Only whoever
 * runs the dashboard can fix that, so the problem is spelled out in the server log as well.
 * 502 rather than the real status, so a stray 404 page is not taken for a missing resource.
 */
function misconfigured(problem: string): ApiError {
  console.error(`${problem}. Set WAU_SERVICES_URL in .env to the gateway, e.g. http://localhost:8080, ` +
    "then restart the dashboard.");
  return new ApiError(502, "SERVICES_MISCONFIGURED", problem);
}

async function readJson(response: Response): Promise<Record<string, unknown> | null> {
  const text = await response.text();
  if (!text) return {};
  try {
    const value: unknown = JSON.parse(text);
    return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
