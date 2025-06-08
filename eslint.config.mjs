import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
        ignores: [
      "app/generated/**",
      // Add Sanity-specific ignores below
      "sanity/**",         // Ignores entire sanity directory
      "studio/**",         // Common alternative directory name
      "schemas/**",        // Schema definitions
      "plugins/**",        // Sanity plugins
      "scripts/**",        // Sanity scripts
      "sanity.config.ts",  // Config files
      "sanity.config.js",
      "sanity.cli.ts",
      "sanity.cli.js"
    ],
  },
];

export default eslintConfig;
