// @ts-check

/**
 * @type {import('lint-staged').Configuration}
 * @see {@link https://github.com/lint-staged/lint-staged#typescript}
 */
const config = {
  "*.{cjs,js,mjs,mts,ts}": "eslint --fix",
  "*.{cjs,js,json,md,mjs,mts,ts}": "prettier --write --log-level warn",
};

export default config;
