import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import perfectionist from "eslint-plugin-perfectionist";
import vitest from "@vitest/eslint-plugin";
import { fileURLToPath } from "url";

const tsconfigRootDir = fileURLToPath(new URL("../", import.meta.url));

export default tseslint.config(
  {
    ignores: ["**/*.js"],
  },

  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir,
        sourceType: "module",
      },
    },
  },

  perfectionist.configs["recommended-natural"],

  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      "@typescript-eslint/unbound-method": "off",
    },
  },
);
