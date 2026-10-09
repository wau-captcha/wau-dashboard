/** Request header the proxy hands the nonce of a page to its Server Components in. */
export const NONCE_HEADER = "x-nonce";

/** Where checkout posts its form: SePay's payment page, live and sandbox. */
const PAYMENT_FORMS = ["https://pay.sepay.vn", "https://pay-sandbox.sepay.vn"];

/** The origin of WAU_PUBLIC_API_URL, which pages may call; empty when it is unset or not a URL. */
function apiOrigin(): string {
  try {
    return new URL(process.env.WAU_PUBLIC_API_URL?.trim() ?? "").origin;
  } catch {
    return "";
  }
}

/**
 * The Content-Security-Policy of one page, with its nonce. Next puts the nonce on its own scripts
 * and 'strict-dynamic' trusts what they load, Google's sign-in script among them. Styles stay
 * 'unsafe-inline': components set style attributes, the widget styles and Google's button inject
 * their own. upgrade-insecure-requests only makes sense for a page served over https.
 */
export function contentSecurityPolicy(nonce: string, https: boolean): string {
  const development = process.env.NODE_ENV === "development";
  const api = apiOrigin();
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://accounts.google.com/gsi/client${development ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style",
    "img-src 'self' data: blob: https://*.googleusercontent.com",
    `connect-src 'self'${api ? ` ${api}` : ""} https://accounts.google.com/gsi/`,
    "frame-src https://accounts.google.com/gsi/",
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    `form-action 'self' ${PAYMENT_FORMS.join(" ")}`,
    "frame-ancestors 'none'",
  ];
  if (https) directives.push("upgrade-insecure-requests");
  return directives.join("; ");
}
