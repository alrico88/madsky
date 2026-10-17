/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  extends: [
    "plugin:vue/vue3-essential",
    "@vue/eslint-config-typescript/recommended",
    "@vue/eslint-config-prettier",
  ],
  rules: {
    "vue/block-order": ["error", { order: ["template", "script", "style"] }],
    "@typescript-eslint/no-unused-vars": "off",
    "vue/multi-word-component-names": "off",
    "object-shorthand": ["error", "properties"],
    "arrow-body-style": "error",
  },
};
