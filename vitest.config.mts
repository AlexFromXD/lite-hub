import { defineConfig } from "vitest/config";

const fiveSecondsInMs = 5 * 1_000;

export default defineConfig({
  test: {
    globals: true,
    passWithNoTests: true,
    environment: "node",
    include: ["test/**/*.spec.{js,ts}"],
    testTimeout: fiveSecondsInMs,
    hookTimeout: fiveSecondsInMs,
  },
});
