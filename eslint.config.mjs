import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Next.jsが自動生成する型ヘルパー(`next dev`/`next build`のたびに上書きされる)
    "routes.d.ts",
    "validator.ts",
    "cache-life.d.ts",
    "root-params.d.ts",
  ]),
]);

export default eslintConfig;
