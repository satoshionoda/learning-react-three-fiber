/** @type {import("prettier").Config} */
const config = {
  semi: true,
  trailingComma: "es5",
  singleQuote: false,
  tabWidth: 2,
  printWidth: 100,
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
export default config;
