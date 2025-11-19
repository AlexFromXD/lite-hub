ARG PNPM_VERSION="10.18.2"

FROM node:22-alpine AS build

WORKDIR /build

RUN npm install -g pnpm@"${PNPM_VERSION}"

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Copy source files for building
COPY . .

RUN NODE_ENV=production node build.mjs

FROM node:22-alpine

WORKDIR /app

COPY --from=build /build/dist/index.js ./index.js

CMD [ "node", "index.js" ]
