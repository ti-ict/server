# ============================================
# Stage 1: Dependencies
# ============================================
FROM oven/bun:alpine AS dependencies
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/docs/package.json ./apps/docs/package.json
RUN --mount=type=cache,target=/root/.bun \
    bun install --frozen-lockfile

# ============================================
# Stage 2: Build
# ============================================
FROM oven/bun:alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json bun.lock ./
COPY apps/web ./apps/web
ARG GIT_COMMIT_SHA
ENV GIT_COMMIT_SHA=${GIT_COMMIT_SHA}
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN cd apps/web && bunx prisma generate
RUN bun run --filter '@proxmox-frontend/web' build
RUN bun run --filter '@proxmox-frontend/web' build

# ============================================
# Stage 3: Runner
# ============================================
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder --chown=node:node /app/apps/web/public ./public
RUN mkdir .next && chown node:node .next
COPY --from=builder --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=builder --chown=node:node /app/apps/web/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
