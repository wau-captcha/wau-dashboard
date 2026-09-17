import "server-only";

import { headers } from "next/headers";
import { getSessionToken } from "@/lib/session";

/** The gateway is reachable from this server only; the browser never calls it. */
const GATEWAY_URL = process.env.GATEWAY_URL ?? "http://127.0.0.1:8080";

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
  /** Attach the session token (default true). */
  auth?: boolean;
  /** Use this token instead of the cookie, e.g. right after signing in. */
  token?: string;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true, token } = options;
  const requestHeaders = new Headers({ Accept: "application/json" });
  if (body !== undefined) requestHeaders.set("Content-Type", "application/json");

  const bearer = token ?? (auth ? await getSessionToken() : null);
  if (bearer) requestHeaders.set("Authorization", `Bearer ${bearer}`);

  // Let the gateway rate limit the real visitor rather than this server.
  const clientIp = (await headers()).get("x-forwarded-for");
  if (clientIp) requestHeaders.set("X-Forwarded-For", clientIp);

  let response: Response;
  try {
    response = await fetch(GATEWAY_URL + path, {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "GATEWAY_UNREACHABLE", "gateway is unreachable");
  }

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as Record<string, unknown>) : {};

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
