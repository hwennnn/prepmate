/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
  },
  outputFileTracingIncludes: {
    // Include WASM files for typst compilation in tRPC API routes
    "/api/trpc/[...trpc]": [
      "./node_modules/@myriaddreamin/typst-ts-web-compiler/pkg/*.wasm",
      "./node_modules/@myriaddreamin/typst-ts-renderer/pkg/*.wasm",
      "./node_modules/@myriaddreamin/typst.ts/dist/**",
      // pnpm paths
      "./node_modules/.pnpm/@myriaddreamin+typst-ts-web-compiler@*/node_modules/@myriaddreamin/typst-ts-web-compiler/pkg/*.wasm",
      "./node_modules/.pnpm/@myriaddreamin+typst-ts-renderer@*/node_modules/@myriaddreamin/typst-ts-renderer/pkg/*.wasm",
      "./node_modules/.pnpm/@myriaddreamin+typst.ts@*/node_modules/@myriaddreamin/typst.ts/dist/**",
    ],
    // Include for all server routes that might use typst compilation
    "**": [
      "./node_modules/@myriaddreamin/typst-ts-web-compiler/pkg/*.wasm",
      "./node_modules/@myriaddreamin/typst-ts-renderer/pkg/*.wasm",
      // pnpm paths
      "./node_modules/.pnpm/@myriaddreamin+typst-ts-web-compiler@*/node_modules/@myriaddreamin/typst-ts-web-compiler/pkg/*.wasm",
      "./node_modules/.pnpm/@myriaddreamin+typst-ts-renderer@*/node_modules/@myriaddreamin/typst-ts-renderer/pkg/*.wasm",
    ],
  },
};

export default config;
