const { dirname } = require("path");
const { fileURLToPath } = require("url");
const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    files: ["**/*.css"],
    rules: {
      "unknownAtRules": "off",
      "css/at-rule-no-unknown": "off",
    },
  },
];