# ============================================
# Stage 1: Dependencies Installation Stage
# ============================================
FROM oven/bun:alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    bun install --frozen-lockfile

# ============================================
# Stage 2: Build Next.js application in standalone mode
# ============================================
FROM oven/bun:alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ARG GIT_COMMIT_SHA
ENV GIT_COMMIT_SHA=${GIT_COMMIT_SHA}
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run db:generate
RUN bun run build

# ============================================
# Stage 3: Run Next.js application
# ============================================
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder --chown=node:node /app/public ./public
RUN mkdir .next && chown node:node .next
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000
CMD ["node", "server.js"]