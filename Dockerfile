# 生产镜像（Next.js standalone 模式）
FROM node:20-bookworm AS deps

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 
WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml* ./

RUN corepack enable \
  && corepack prepare pnpm@latest-1 --activate \
  && pnpm install --frozen-lockfile

FROM node:20-bookworm AS builder
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable \
  && corepack prepare pnpm@latest-1 --activate \
  && pnpm run build

FROM node:20-alpine AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

RUN addgroup -g 1001 nodejs \
  && adduser -S nextjs -u 1001 -G nodejs

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.env.example ./env.example

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
