FROM node:20-alpine
WORKDIR /workspace
RUN corepack enable
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages
RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter @nexgile/db generate
RUN pnpm build
CMD ["pnpm", "dev"]
