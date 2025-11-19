FROM node:22-alpine AS build

WORKDIR /build

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@10.18.2 && pnpm install

COPY . /build/

RUN pnpm build

FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@10.18.2 && pnpm install --no-dev

COPY --from=build /build/dist /app/dist

CMD [ "pnpm", "start" ]
