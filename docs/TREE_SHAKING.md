# Tree Shaking Implementation

This project now implements **tree shaking** using esbuild to significantly reduce bundle size and improve performance.

## Build System Comparison

| Build Type           | Size | Files       | Tool      | Tree Shaking | Minification  |
| -------------------- | ---- | ----------- | --------- | ------------ | ------------- |
| **Old (TypeScript)** | 268K | 15 JS files | `tsc`     | ❌ None      | ❌ None       |
| **New (Bundled)**    | 28K  | 1 JS file   | `esbuild` | ✅ Enabled   | ✅ Production |

## Benefits

- **🌳 Tree Shaking**: Eliminates dead code and unused exports
- **📦 90% Size Reduction**: From 268KB to 9KB (minified production bundle)
- **🚀 Faster Startup**: Single optimized JavaScript file
- **🔧 Better Deployment**: Simplified Docker images with minimal footprint
- **📊 Bundle Analysis**: Built-in analysis tools to track dependencies

## Build Scripts

```bash
# Development build (with source maps, no minification)
pnpm build

# Production build (minified, optimized for Docker)
pnpm build:prod

# Analyze bundle size and dependencies
pnpm build:analyze

# Legacy TypeScript-only build (for comparison)
pnpm build:tsc
```

## Configuration Files

- **`build.mjs`**: esbuild configuration with tree shaking
- **`tsconfig.json`**: Updated for ESNext modules (better tree shaking)
- **`Dockerfile`**: Optimized for new build process

## Tree Shaking Features

1. **Dead Code Elimination**: Removes unused functions and variables
2. **Import Analysis**: Only includes actually used exports
3. **Bundle Splitting**: Keeps Node.js dependencies external
4. **Production Optimizations**:
   - Minification
   - Drop console.log statements
   - Optimized for Node.js runtime

## Docker Optimization

The Dockerfile now:

- Uses production build with tree shaking
- Creates minimal production `package.json`
- Installs only runtime dependencies in final image
- Results in smaller, faster Docker images

## Bundle Analysis

Run `pnpm build:analyze` to see:

- Per-file contribution to bundle size
- Import/export tree
- Optimization opportunities
- Detailed metadata in `dist/meta.json`
