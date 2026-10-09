import "server-only";

/** The services /status checks, by the variable that holds each one's address. */
const SERVICES = {
  challenge: "WAU_CHALLENGE_URL",
  verify: "WAU_VERIFY_URL",
  tenant: "WAU_TENANT_URL",
  billing: "WAU_BILLING_URL",
} as const;

export type ServiceName = keyof typeof SERVICES;

export type ServiceStatus = {
  name: ServiceName;
  /** /healthz answered 200 within the timeout. */
  up: boolean;
  /** Null when it did not answer at all. */
  responseMs: number | null;
};

export type StatusReport = {
  checkedAt: string;
  up: boolean;
  services: ServiceStatus[];
};

const TIMEOUT_MS = 2000;
/** One check serves every visitor for this long, so the page cannot be used to flood the services. */
const FRESH_MS = 30_000;

let latest: { report: StatusReport; at: number } | undefined;
let running: Promise<StatusReport> | undefined;

/** The health of each service, checked from this server at most every 30 seconds. */
export async function getStatus(): Promise<StatusReport> {
  if (latest && Date.now() - latest.at < FRESH_MS) return latest.report;
  running ??= checkAll().finally(() => {
    running = undefined;
  });
  return running;
}

async function checkAll(): Promise<StatusReport> {
  const services = await Promise.all((Object.keys(SERVICES) as ServiceName[]).map(probe));
  const report = { checkedAt: new Date().toISOString(), up: services.every((service) => service.up), services };
  latest = { report, at: Date.now() };
  return report;
}

async function probe(name: ServiceName): Promise<ServiceStatus> {
  const base = process.env[SERVICES[name]]?.trim().replace(/\/+$/, "");
  if (!base) return { name, up: false, responseMs: null };
  const started = performance.now();
  try {
    const response = await fetch(`${base}/healthz`, { cache: "no-store", redirect: "manual", signal: AbortSignal.timeout(TIMEOUT_MS) });
    return { name, up: response.ok, responseMs: Math.round(performance.now() - started) };
  } catch {
    return { name, up: false, responseMs: null };
  }
}
