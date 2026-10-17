# ---------- Dependencies stage ----------
FROM oven/bun:1.4.3-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

# ---------- Build stage ----------
FROM oven/bun:1.4.3-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bun run build

# ---------- Production stage ----------
FROM oven/bun:1.4.3-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0

COPY --from=build /app/.output /app/.output

EXPOSE 3000

CMD ["bun", "/app/.output/server/index.mjs"]
