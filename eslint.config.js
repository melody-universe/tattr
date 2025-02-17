// @ts-check

import eslint from "@eslint/js";
import eslintPluginPerfectionist from "eslint-plugin-perfectionist";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import eslintPluginReact from "eslint-plugin-react";
import typescriptEslint from "typescript-eslint";

export default typescriptEslint.config(
  { ignores: [".react-router", "build"] },
  eslint.configs.recommended,
  typescriptEslint.configs.strictTypeChecked,
  typescriptEslint.configs.stylisticTypeChecked,
  eslintPluginPerfectionist.configs["recommended-natural"],
  eslintPluginPrettier,
  eslintPluginReact.configs.flat.recommended,
  eslintPluginReact.configs.flat["jsx-runtime"],
  {
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        { allowedNames: ["action", "loader"] },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "perfectionist/sort-exports": ["off"],
      "perfectionist/sort-modules": ["off"],
      "perfectionist/sort-objects": [
        "error",
        {
          customGroups: [
            { elementNamePattern: "^id$", groupName: "id" },
            { elementNamePattern: "^kind$", groupName: "kind" },
          ],
          groups: ["kind", "id", "unknown"],
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
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
