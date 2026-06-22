import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "build/**",
      ".docusaurus/**",
      "node_modules/**",
      "**/*.mdx",
      "**/*.md"
    ]
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]
    }
  }
);
