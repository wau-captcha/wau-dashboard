# wau-dashboard

The website of WAU Captcha at https://waucaptcha.com, built with Next.js. It has the public site
(home page, captcha pages, docs, pricing, changelog, legal and status pages), the customer
dashboard where users sign in with Google to manage API keys, usage and billing, a separate admin
console, and `/demo`, a living style guide of the components in `components/ui` that only `next dev`
serves (a production build answers 404 there). It holds no data
of its own: its server calls the tenant and billing services of wau-services.

## Stack

| Part | Version (`package.json`) |
| --- | --- |
| Next.js (App Router, `output: "standalone"`) | 16.3.5 |
| React and React DOM | 19.2.8 |
| Tailwind CSS (with `@tailwindcss/postcss`) | ^4 |
| TypeScript | ^5 |
| ESLint (`eslint-config-next`) | ^9 (16.3.5) |
| Base UI (`@base-ui/react`) | ^1.8.0 |
| lucide-react | ^1.46.0 |
| pnpm (`packageManager`) | 11.2.2 |

CI and the Docker image use Node.js 24.

## Routes

| Route group | Pages | What they are |
| --- | --- | --- |
| `(site)` | `/` | Home page: what WAU Captcha is, how it works, how to start. |
| | `/captchas`, `/captchas/[slug]` | Every captcha type, and one page per type (`image-distort`, `motion-noise`, `slide-puzzle`, `animal-jump`, `object-rotate`, `auto-check`). |
| | `/captchas/behavior` | The behaviour check behind every captcha. |
| | `/captchas/samples` | Real challenges with their answers, for benchmarking a solver. |
| | `/docs` | The integration guide. |
| | `/pricing` | The plans. |
| | `/changelog` | Notable changes, from `lib/changelog.ts`. |
| | `/about`, `/security` | About the service; how to report a vulnerability. |
| | `/status` | Whether each service answers its `/healthz`. |
| | `/legal/privacy`, `/legal/terms` | Privacy policy and terms; `/privacy` and `/terms` redirect here. |
| `(auth)` | `/login`, `/admin/login` | Google sign-in for users, and for administrators. |
| | `/session-expired`, `/admin/session-expired` | Route handlers that sign out a browser whose token wau-services rejects. |
| `(dashboard)` | `/overview` | Usage and the status of the user's API keys. |
| | `/keys`, `/keys/[id]` | Create, pause and delete keys; one key's secrets, allowed domains and addresses, usage and activity. |
| | `/billing`, `/billing/history`, `/billing/history/[id]` | Plan and upgrades; payment history; one payment. |
| | `/account` | Account details and the captcha types the user may use. |
| `(admin)` | `/admin` | Admin overview: stats and usage. |
| | `/admin/users`, `/admin/users/[id]` | Users; one user with their keys and usage. |
| | `/admin/appeals` | Reviews owners asked for, of keys that were suspended or throttled. |
| `demo` | `/demo` | Living style guide: every component in `components/ui`. Development only: 404 in a production build. |

Also `app/status.json/route.ts` (`/status.json`, the status check as JSON for monitors) and
`app/.well-known/security.txt/route.ts`.

`proxy.ts` lets visitors without a session cookie reach only the public pages, the sign-in pages and
`/demo` (under `next dev`); it sends them to `/login`, or to `/admin/login` for `/admin`. Users and administrators
have separate sessions.

## Run locally

Start wau-services first (see its README): the infrastructure with docker compose and the four
services, which listen on `localhost:8000` to `localhost:8003`, with Caddy on `localhost:8080`.

```bash
pnpm install
pnpm dev
```

Settings come from the environment; for local runs put them in a `.env` file in the repository root
(gitignored). To talk to a local wau-services:

```bash
WAU_TENANT_URL=http://localhost:8002
WAU_BILLING_URL=http://localhost:8003
WAU_CHALLENGE_URL=http://localhost:8000
WAU_VERIFY_URL=http://localhost:8001
WAU_PUBLIC_API_URL=http://localhost:8080
GOOGLE_CLIENT_ID=<your-value>
```

The dashboard calls `<WAU_TENANT_URL>/v1/...` and `<WAU_BILLING_URL>/v1/billing/...`, so both may
also be `http://localhost:8080`, where Caddy routes `/v1/billing/*` to billing and the rest of `/v1/*`
to tenant. Keep the direct ports if you use `/status`: it calls `/healthz` on each address, and
Caddy does not route `/healthz`.

Google sign-in needs:

- an OAuth client ID from Google Cloud, set as `GOOGLE_CLIENT_ID` here and as
  `KRATOS_GOOGLE_CLIENT_ID` in tenant; tenant also needs `KRATOS_GOOGLE_JWKS_URL`;
- the address you open the dashboard at (for `pnpm dev`, `http://localhost:3000` by default) among
  the client's Authorized JavaScript origins;
- for the admin console, a Google account whose email is in the `admins` table of the database.

Session cookies are marked `secure` only when `NODE_ENV` is `production`, so sign-in works over
plain http under `pnpm dev`.

## Configuration

Every variable is read by the server at run time, never at build time, so one build or Docker image
serves every environment. Changes apply once the server restarts or reloads its environment.

| Variable | Required | Read when | Meaning |
| --- | --- | --- | --- |
| `WAU_TENANT_URL` | yes | run time | Base URL of tenant, without `/v1`. Every `/v1` call that is not `/v1/billing/` goes there. `/status` checks it too. |
| `WAU_BILLING_URL` | yes | run time | Base URL of billing; `/v1/billing/` calls go there. `/status` checks it too. |
| `WAU_CHALLENGE_URL` | no | run time | Base URL of challenge, for `/status` and `/status.json` only. Unset: shown as down. |
| `WAU_VERIFY_URL` | no | run time | Base URL of verify, for `/status` and `/status.json` only. Unset: shown as down. |
| `WAU_PUBLIC_API_URL` | no | run time | The API address shown in code samples (default `https://captcha.example.com`), and allowed in the `connect-src` of the Content-Security-Policy. `https://api.waucaptcha.com` in production. |
| `GOOGLE_CLIENT_ID` | yes, for sign-in | run time | Google OAuth client ID of the sign-in button; the same value as tenant's `KRATOS_GOOGLE_CLIENT_ID`. |
| `NODE_ENV` | set by Next | build and run time | `production` adds HSTS and secure cookies; `development` adds `'unsafe-eval'` to the CSP. |

In production `deploy/k3s/dashboard.yaml` in wau-services sets the service URLs to the cluster
addresses and `WAU_PUBLIC_API_URL` to `https://api.waucaptcha.com`; `GOOGLE_CLIENT_ID` comes from the
Secret `wau-env`.

The Docker image listens on port 3000:

```bash
docker build -t wau-dashboard .
docker run -p 3000:3000 -e WAU_TENANT_URL=<tenant-url> -e WAU_BILLING_URL=<billing-url> \
  -e WAU_PUBLIC_API_URL=https://api.waucaptcha.com -e GOOGLE_CLIENT_ID=<your-value> wau-dashboard
```

## Code map

- `proxy.ts`: runs before each page. Gives every page a Content-Security-Policy with its own nonce,
  sends visitors without a session cookie to the sign-in page, and issues the Google nonce cookie on
  `/login` and `/admin/login`.
- `lib/api/`: the server-only client of wau-services. `client.ts` has `apiFetch`, which picks
  `WAU_TENANT_URL` or `WAU_BILLING_URL` by path, attaches the session token and turns error replies
  into `ApiError`. One module per area: `auth.ts`, `api-keys.ts`, `usage.ts`, `plans.ts`,
  `billing.ts`, `admin.ts`; shapes in `types.ts`.
- `lib/i18n/`: English and Vietnamese texts (see [Translations](#translations)).
- `lib/csp.ts`: builds the Content-Security-Policy of a page from its nonce.
- `lib/nonce.ts`: `getNonce()`, the nonce the proxy gave the current page, for inline scripts.
- `lib/session.ts`: the session cookies (`wau_session`, and `wau_admin_session`, sent to `/admin`
  only): read, set, clear, and end a session wau-services rejects. Cookie names shared with the
  proxy are in `lib/session-cookie.ts`.
- `lib/challenge-types.ts`: label and description of a challenge type id from the translations;
  unknown ids are shown as they are.
- `lib/captchas.ts`: the captcha types the public pages show (slug, API id, SDK constant, size,
  keyboard support) and the shape of the samples in `public/captchas/samples`.
- `lib/sdk-cdn.ts`: the `@waucaptcha-sdk/client` version and Subresource Integrity hash that the CDN
  snippet in the docs uses.
- `lib/contact.ts`: operator name, contact email and site URL, as the public pages and
  `security.txt` state them.
- Also: `lib/dal.ts` (the signed-in user or administrator, checked against wau-services once per
  request), `lib/status.ts` (the health checks behind `/status`), `lib/google.ts` (Google client ID
  and nonce), `lib/changelog.ts` (the entries of `/changelog`).

## Translations

The site ships English (`en`, the default) and Vietnamese (`vi`); the choice is kept in the cookie
`wau_locale` (`lib/i18n/config.ts`).

- Texts live in `lib/i18n/messages/`, one module per area (`site.ts`, `docs.ts`, `keys.ts`,
  `billing.ts`, ...). Each module defines `en`, then `vi` typed as `Translation<typeof en>`, and
  exports both, e.g. `export const keys = { en, vi };`.
- `lib/i18n/dictionary.ts` joins the modules into one `Dictionary` per language.
- Server Components and Server Actions get the texts with `getI18n()` from `lib/i18n/server.ts`;
  Client Components with `useI18n()` from `lib/i18n/client.ts`. Both return `{ locale, t, format }`.
- The default texts of the components in `components/ui` are in `components/ui/ui-text.ts`, built
  the same way.

To add a string:

1. Add the key to `en` in the right module of `lib/i18n/messages/`.
2. Add the Vietnamese text under the same key in `vi`. A missing or extra key fails the type check,
   so `pnpm build` catches it.
3. Use it as `t.<area>.<key>`, e.g. `t.keys.list.metaTitle`.

A new module also needs its `en` and `vi` entries, and its type, in `lib/i18n/dictionary.ts`.

## After each SDK release

The docs show a `<script>` tag that loads `@waucaptcha-sdk/client` from jsDelivr, pinned to an exact
version with its integrity hash. Both live in `lib/sdk-cdn.ts` and change together:

1. Once the new `@waucaptcha-sdk/client` version is on npm, run in wau-sdk-js:

   ```bash
   node scripts/sri.mjs <version>
   ```

2. Set `CLIENT_CDN_VERSION` in `lib/sdk-cdn.ts` to that version and `CLIENT_CDN_INTEGRITY` to the
   printed `sha384-...` hash.
3. Run the checks below and merge to `main`.

## Checks

```bash
pnpm lint
pnpm build
```

`pnpm build` also type-checks, which covers the translations. There are no automated tests yet.

## CI/CD

- `.github/workflows/ci.yml` runs on every push and pull request: `pnpm install --frozen-lockfile`,
  `pnpm lint` and `pnpm build` on Node.js 24, with pnpm from `packageManager`.
- `.github/workflows/release.yml` runs on every push to `main`, or by hand. After CI passes it builds
  a linux/arm64 image and pushes it to ECR as `wau/dashboard:sha-<first 7 characters of the commit>`.
  Then it checks out wau-services, sets the `newTag` of `wau/dashboard` in
  `deploy/k3s/kustomization.yaml` there, and `github-actions[bot]` commits it to wau-services `main`
  as `chore(deploy): release dashboard sha-... [skip ci]`. Argo CD deploys it from there.

Rollback and the rest of the deployment are described in the README of wau-services and its
`deploy/README.md`.
