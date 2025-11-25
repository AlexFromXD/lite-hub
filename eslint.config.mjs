// @ts-check

// Ref: https://typescript-eslint.io/getting-started#step-2-configuration
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  eslint.configs.recommended,

  // This covers TypeScript-specific rules and settings for
  // - @typescript-eslint/eslint-plugin
  // - @typescript-eslint/parser
  tseslint.configs.recommended,

  {
    ignores: ["dist/", "node_modules/"],
  },

  // ESM-specific configuration for .mjs files
  {
    files: ["**/*.mjs"],
    languageOptions: {
      globals: globals.node,
      sourceType: "module",
    },
  },

  // CommonJS-specific configuration
  {
    files: ["example/**/*.js"],
    languageOptions: {
      globals: globals.node,
      sourceType: "commonjs",
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
);
