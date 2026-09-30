import "server-only";

import { headers } from "next/headers";
import { endAdminSession, endSession, getSessionToken, type SessionKind } from "@/lib/session";

/**
 * The services this server calls for the dashboard, each at its own address: inside the cluster
 * on EKS, where /v1 is not public. Billing owns /v1/billing/, tenant every other /v1 path. The
 * addresses only come from the environment (.env), read per call so an edit applies once the
 * server reloads it.
 */
const SERVICES = {
  WAU_TENANT_URL: { name: "tenant", example: "http://localhost:8002" },
  WAU_BILLING_URL: { name: "billing", example: "http://localhost:8003" },
} as const;

type ServiceVariable = keyof typeof SERVICES;

function serviceFor(path: string): ServiceVariable {
  return path.startsWith("/v1/billing/") ? "WAU_BILLING_URL" : "WAU_TENANT_URL";
}

function serviceUrl(variable: ServiceVariable): string {
  const url = process.env[variable]?.trim().replace(/\/+$/, "");
  if (!url) throw misconfigured(variable, `${variable} is not set`);
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
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
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
  const variable = serviceFor(path);
  const base = serviceUrl(variable);
  const requestHeaders = new Headers({ Accept: "application/json" });
  if (body !== undefined) requestHeaders.set("Content-Type", "application/json");

  const bearer = token ?? (auth ? await getSessionToken(session) : null);
  if (bearer) requestHeaders.set("Authorization", `Bearer ${bearer}`);

  const host = (await headers()).get("host");
  if (host && sameHost(base, host)) {
    throw misconfigured(variable, `${variable}=${base} is the address of this dashboard, not of ${SERVICES[variable].name}`);
  }

  let response: Response;
  try {
    response = await fetch(base + path, {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      // Tenant and billing answer every /v1 call themselves; a redirect means this is another server.
      redirect: "manual",
    });
  } catch {
    throw new ApiError(0, "SERVICES_UNREACHABLE", `${SERVICES[variable].name} is unreachable at ${base}`);
  }

  if (response.status >= 300 && response.status < 400) {
    throw misconfigured(variable,
      `${variable}=${base} redirected ${method} ${path} to ${response.headers.get("location")}`);
  }

  const payload = await readJson(response);
  if (!payload) {
    throw misconfigured(variable, `${variable}=${base} answered ${method} ${path} with ${response.status} and no JSON`);
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
 * WAU_TENANT_URL or WAU_BILLING_URL is missing or points at something that is not that service.
 * Only whoever runs the dashboard can fix that, so the problem is spelled out in the server log as
 * well. 502 rather than the real status, so a stray 404 page is not taken for a missing resource.
 */
function misconfigured(variable: ServiceVariable, problem: string): ApiError {
  const { name, example } = SERVICES[variable];
  console.error(`${problem}. Set ${variable} in .env to the ${name} service, e.g. ${example}, ` +
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
