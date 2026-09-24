import "server-only";

import { servicesUrl } from "@/lib/api/client";

/** Placeholder shown in code samples when WAU_SERVICES_URL is not set. */
const EXAMPLE_BASE_URL = "https://captcha.example.com";

/** The gateway address the public pages show in code samples: this installation's, when known. */
export function docsBaseUrl(): string {
  try {
    return servicesUrl();
  } catch {
    return EXAMPLE_BASE_URL;
  }
}
