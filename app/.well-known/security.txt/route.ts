import { CONTACT_EMAIL, SITE_URL } from "@/lib/contact";

// Built once per release, so Expires is a year after the build and every release renews it.
export const dynamic = "force-static";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

/** RFC 9116: where to report a vulnerability. No PGP key for now. */
export function GET() {
  const expires = new Date(Date.now() + ONE_YEAR_MS).toISOString().replace(/\.\d{3}Z$/, "Z");
  const body = [
    `Contact: mailto:${CONTACT_EMAIL}`,
    `Expires: ${expires}`,
    "Preferred-Languages: vi, en",
    `Canonical: ${SITE_URL}/.well-known/security.txt`,
    `Policy: ${SITE_URL}/security`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
