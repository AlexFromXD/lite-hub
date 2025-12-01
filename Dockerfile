ARG PNPM_VERSION="10.18.2"

# Build stage
FROM node:22-alpine AS build

# Disable Husky git hooks during build
ENV CI=true

WORKDIR /build

RUN apk add --no-cache --virtual .build-deps \
    && npm install -g pnpm@"${PNPM_VERSION}" --no-audit --no-fund

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --production=false --ignore-scripts

# Copy source files for building
COPY . .

# Build then remove build dependencies and unnecessary files
RUN NODE_ENV=production pnpm tsdown \
    && apk del .build-deps \
    && rm -rf /root/.npm /root/.pnpm-store /tmp/* /var/tmp/*

# Minimal runtime using Alpine that has Node.js v22 available
FROM alpine:3.21 AS runtime

# Install Node.js and compress/strip everything unnecessary
RUN apk add --no-cache nodejs=22.15.1-r0 \
    && apk add --no-cache --virtual .build-tools binutils=2.43.1-r3 upx=4.2.4-r0 \
    && strip /usr/bin/node \
    && upx --best --lzma /usr/bin/node \
    && find /usr -name "*.a" -delete \
    && find /usr -name "*.la" -delete \
    && rm -rf /usr/include /usr/lib/pkgconfig /usr/lib/cmake \
    && rm -rf /usr/share/man /usr/share/doc /usr/share/info \
    && rm -rf /var/cache/apk/* /tmp/* /var/tmp/* /root/.npm \
    && apk del .build-tools

# Create minimal non-root user
RUN adduser -D -s /sbin/nologin -u 1001 app

WORKDIR /app

COPY --from=build --chown=1001:1001 /build/dist/index.cjs ./index.js

# Switch to non-root user
USER 1001

CMD ["node", "index.js"]
