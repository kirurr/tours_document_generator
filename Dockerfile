# syntax=docker.io/docker/dockerfile:1

############################
# Build stage (Node.js)
############################
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN npm install -g bun

RUN bun install --frozen-lockfile

COPY . .
COPY .env .env

RUN bun run build


############################
# Runtime stage (Bun)
############################
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 appgroup \
  && adduser --system --uid 1001 appuser

COPY --from=builder /app/public ./public
COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /app/.next/static ./.next/static
COPY --from=builder --chown=appuser:appgroup /app/.env .env

USER appuser

EXPOSE 3000

CMD ["node", "server.js"]

