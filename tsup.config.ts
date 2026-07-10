import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["scripts/index.ts"],
  outDir: "dist",
  sourcemap: false,
  minify: true,
  // TypeScript 7 (native) removed the JS compiler API that rollup-plugin-dts
  // needs; only dist/index.js ships (see "files"), so no consumer loses types.
  dts: false,
  format: ["cjs", "esm"],
});
