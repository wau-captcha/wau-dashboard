# docker build -t wau-dashboard wau-dashboard
# docker run -p 3000:3000 -e WAU_TENANT_URL=http://tenant:8002 -e WAU_BILLING_URL=http://billing:8003 \
#   -e WAU_PUBLIC_API_URL=https://api.waucaptcha.com -e GOOGLE_CLIENT_ID=... wau-dashboard
# Every setting is read by the server at run time, never at build time, so one image serves every
# environment. Run all replicas from the same image: its build carries the Server Actions key.
FROM node:24-alpine AS base
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
	NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
	NEXT_TELEMETRY_DISABLED=1 \
	HOSTNAME=0.0.0.0 \
	PORT=3000
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
