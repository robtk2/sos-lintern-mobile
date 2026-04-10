const expo = require("eslint-config-expo/flat");

module.exports = [
  ...expo,
  {
    ignores: [
      "**/node_modules/**",
      ".expo/**",
      "android/**",
      "ios/**",
      "docs/**",
      "coverage/**",
      "*.config.js",
      "*.config.cjs"
    ],
  },
  {
    languageOptions: {
      globals: {
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        process: "readonly",
        module: "readonly",
        require: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
