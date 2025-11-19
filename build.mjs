#!/usr/bin/env node

import { promises as fs } from "node:fs";
import * as esbuild from "esbuild";

const isProduction = process.env.NODE_ENV === "production";

// Clean the dist directory
async function cleanDist() {
  try {
    await fs.rm("./dist", { recursive: true, force: true });
    console.log("✓ Cleaned dist directory");
  } catch (error) {
    // Directory doesn't exist, that's fine
  }
}

// Main build function
async function build() {
  console.log(
    `🚀 Building for ${isProduction ? "production" : "development"}...`,
  );

  await cleanDist();

  try {
    const result = await esbuild.build({
      // Entry points
      entryPoints: ["src/index.ts"],

      // Output configuration
      outfile: "dist/index.js",
      bundle: true,

      // Platform and format
      platform: "node",
      target: "node22",
      format: "cjs",

      // Tree shaking and optimization
      treeShaking: true,
      minify: isProduction,
      sourcemap: !isProduction,

      // Bundle node_modules for tree shaking (only keep Node.js built-ins external)
      external: [
        // Only Node.js built-ins should be external
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

      // TypeScript support
      loader: {
        ".ts": "ts",
      },

      // Resolve configuration
      resolveExtensions: [".ts", ".js", ".json"],

      // Advanced options for better tree shaking
      define: {
        "process.env.NODE_ENV": JSON.stringify(
          process.env.NODE_ENV || "development",
        ),
      },

      // Output analysis
      metafile: true,

      // Disable some features for Node.js
      banner: {
        js: "#!/usr/bin/env node",
      },

      // Keep function and class names for better debugging
      keepNames: !isProduction,
    });

    // Output bundle analysis
    if (result.metafile) {
      const analysis = await esbuild.analyzeMetafile(result.metafile);
      console.log("\n📊 Bundle Analysis:");
      console.log(analysis);

      // Save metafile for further analysis
      await fs.writeFile(
        "./dist/meta.json",
        JSON.stringify(result.metafile, null, 2),
      );
    }

    // Get bundle size
    const stats = await fs.stat("./dist/index.js");
    const sizeKB = (stats.size / 1024).toFixed(2);

    console.log(`✅ Build completed successfully!`);
    console.log(`📦 Bundle size: ${sizeKB} KB`);
    console.log(`🌳 Tree shaking: enabled`);
    console.log(`🗜️  Minification: ${isProduction ? "enabled" : "disabled"}`);
    console.log(`🗺️  Source maps: ${!isProduction ? "enabled" : "disabled"}`);
    console.log(`📁 Output: Single self-contained JavaScript file`);
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

// Handle different build modes
const command = process.argv[2];

switch (command) {
  case "analyze":
    process.env.NODE_ENV = "production";
    console.log("🔍 Running build analysis...");
    await build();
    break;

  case "production":
    process.env.NODE_ENV = "production";
    await build();
    break;

  default:
    await build();
    break;
}
