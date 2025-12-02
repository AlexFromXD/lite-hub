# Tree Shaking Implementation

This project implements **tree shaking** using tsdown (powered by Rolldown) to significantly reduce bundle size and improve performance.

## Build System Comparison

| Build Type            | Size | Files       | Tool     | Tree Shaking | Minification  |
| --------------------- | ---- | ----------- | -------- | ------------ | ------------- |
| **Old (TypeScript)**  | 268K | 15 JS files | `tsc`    | ❌ None      | ❌ None       |
| **Current (Bundled)** | 874K | 1 JS file   | `tsdown` | ✅ Enabled   | ✅ Production |

## Benefits

- **🌳 Tree Shaking**: Eliminates dead code and unused exports
- **📦 Single Bundle**: One optimized JavaScript file for deployment
- **🚀 Faster Startup**: Single optimized JavaScript file
- **🔧 Better Deployment**: Simplified Docker images with minimal footprint
- **📊 Bundle Analysis**: Built-in analysis tools to track dependencies
- **⚡ Rust Performance**: Powered by Rolldown (Rust-based bundler)

## Build Scripts

```bash
# Development build (with source maps, no minification)
pnpm build

# Production build (minified, optimized for Docker)
pnpm build:prod

# Legacy TypeScript-only build (for comparison)
pnpm build:tsc
```

## Configuration Files

- **`tsdown.config.ts`**: tsdown configuration with tree shaking
- **`tsconfig.json`**: TypeScript configuration
- **`Dockerfile`**: Optimized for new build process

## Tree Shaking Features

1. **Dead Code Elimination**: Removes unused functions and variables
2. **Import Analysis**: Only includes actually used exports
3. **Bundle Splitting**: Keeps Node.js dependencies external
4. **Production Optimizations**:
   - Minification
   - Environment variable inlining
   - Optimized for Node.js runtime

## Docker Optimization

The Dockerfile now:

- Uses production build with tree shaking
- Creates minimal production bundle
- Results in smaller, faster Docker images

## Bundle Analysis

Run `pnpm build:prod` to see:

- Bundle size reporting
- Gzip compression analysis
- Build performance metrics
