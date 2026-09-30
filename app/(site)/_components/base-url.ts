import "server-only";

/** Placeholder shown in code samples when WAU_PUBLIC_API_URL is not set. */
const EXAMPLE_BASE_URL = "https://captcha.example.com";

/**
 * The address the public pages show in code samples: WAU_PUBLIC_API_URL, the one customers call
 * (e.g. https://api.waucaptcha.com), when this installation sets it. Read per request, so the
 * same build serves any environment.
 */
export function docsBaseUrl(): string {
  return process.env.WAU_PUBLIC_API_URL?.trim().replace(/\/+$/, "") || EXAMPLE_BASE_URL;
}
