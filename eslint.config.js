// Use the instructor's configuration here if a separate class file is provided.
import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/**"] },
  js.configs.recommended,
  {
    files: ["js/**/*.js"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["scripts/**/*.mjs", "*.config.js"],
    languageOptions: { globals: globals.node },
  },
];
