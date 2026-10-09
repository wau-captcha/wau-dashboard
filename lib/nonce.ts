import "server-only";

import { headers } from "next/headers";
import { NONCE_HEADER } from "./csp";

/** The nonce the proxy gave this page; inline scripts need it to run under its policy. */
export async function getNonce(): Promise<string | undefined> {
  return (await headers()).get(NONCE_HEADER) ?? undefined;
}
