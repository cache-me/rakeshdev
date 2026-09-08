FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/api/package.json apps/api/
COPY packages/db/package.json packages/db/
COPY packages/contracts/package.json packages/contracts/
COPY packages/types/package.json packages/types/
COPY packages/validation/package.json packages/validation/
COPY packages/resume/package.json packages/resume/
COPY packages/config/package.json packages/config/
COPY packages/ui/package.json packages/ui/
RUN pnpm install --frozen-lockfile || pnpm install

FROM deps AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY . .
RUN chmod +x apps/api/docker-entrypoint.sh
EXPOSE 3000
CMD ["apps/api/docker-entrypoint.sh"]
