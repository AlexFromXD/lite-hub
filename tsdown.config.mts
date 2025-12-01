import { defineConfig } from "tsdown";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  entry: "src/index.ts",
  outDir: "dist",
  format: "cjs",
  platform: "node",
  target: "node22",

  // Environment-based optimizations
  minify: isProduction,
  sourcemap: !isProduction,

  clean: true, // Remove previous builds
  treeshake: true, // Remove unused code
  noExternal: [/.*/], // Bundle all dependencies in the output
  report: true, // Bundle reporting
});
