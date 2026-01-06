# ---------- Dependencies stage ----------
FROM oven/bun:1.3.3-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

# ---------- Build stage ----------
FROM oven/bun:1.3.3-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bun run build

# ---------- Production stage ----------
FROM node:24.12-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0

COPY --from=build /app/.output /app/.output

EXPOSE 3000

CMD ["node", "/app/.output/server/index.mjs"]
