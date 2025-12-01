import { defineConfig } from "tsdown";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  // Entry point
  entry: "src/index.ts",

  // Output configuration
  outDir: "dist",
  format: "cjs",

  // Platform and target
  platform: "node",
  target: "node22",

  // Environment-based optimizations
  minify: isProduction,
  sourcemap: !isProduction,

  // Built-in features
  clean: true,
  treeshake: true,

  // Bundle all dependencies except Node.js built-ins
  // This matches the esbuild behavior
  noExternal: [/.*/], // Bundle everything
  external: [
    // Only Node.js built-ins should be external (same as esbuild config)
    "fs",
    "path",
    "http",
    "https",
    "url",
    "crypto",
    "util",
    "events",
    "stream",
    "buffer",
    "querystring",
    "zlib",
    "net",
    "tls",
    "os",
    "child_process",
  ],

  // Bundle reporting
  report: true,

  // Environment variables
  env: {
    NODE_ENV: process.env.NODE_ENV || "development",
  },
});
