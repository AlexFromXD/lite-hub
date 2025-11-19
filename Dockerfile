ARG PNPM_VERSION="10.18.2"

FROM node:22-alpine AS build

WORKDIR /build

RUN npm install -g pnpm@"${PNPM_VERSION}"

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Copy all files to the build context
COPY . .

RUN pnpm build \
  # Prune dev dependencies
  && CI=true pnpm prune --prod

FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY --from=build /build/node_modules ./node_modules
COPY --from=build /build/dist ./dist

CMD [ "npm", "start" ]
