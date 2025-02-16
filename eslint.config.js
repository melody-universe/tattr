// @ts-check

import eslint from "@eslint/js";
import eslintPluginPerfectionist from "eslint-plugin-perfectionist";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import typescriptEslint from "typescript-eslint";

export default typescriptEslint.config(
  { ignores: [".react-router", "build"] },
  eslint.configs.recommended,
  typescriptEslint.configs.strictTypeChecked,
  typescriptEslint.configs.stylisticTypeChecked,
  eslintPluginPerfectionist.configs["recommended-natural"],
  eslintPluginPrettier,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "perfectionist/sort-objects": [
        "error",
        {
          customGroups: [{ elementNamePattern: "^id$", groupName: "id" }],
          groups: ["id", "unknown"],
        },
      ],
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            "drizzle.config.ts",
            "eslint.config.js",
            "react-router.config.ts",
          ],
          defaultProject: "tsconfig.cloudflare.json",
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
