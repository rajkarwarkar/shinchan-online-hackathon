import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    ".agent/**",
    ".next/**",
    "node_modules/**",
    "dist/**",
    "build/**"
  ])
]);

export default eslintConfig;

