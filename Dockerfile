# 生产镜像（Next.js standalone 模式）
FROM node:20-alpine AS deps

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ARG PNPM_VERSION=9
RUN apk add --no-cache libc6-compat   && npm install -g pnpm@${PNPM_VERSION}

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml* ./
COPY pnpm-workspace.yaml* ./

RUN pnpm install --frozen-lockfile

FROM node:20-alpine AS builder
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ARG PNPM_VERSION=9
RUN apk add --no-cache libc6-compat   && npm install -g pnpm@${PNPM_VERSION}
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm run build

FROM node:20-alpine AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

RUN apk add --no-cache libc6-compat   && addgroup -g 1001 nodejs   && adduser -S nextjs -u 1001 -G nodejs

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.env.example ./env.example

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
