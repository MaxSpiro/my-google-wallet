module.exports = {
  extends: "next/core-web-vitals",
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        quotes: ["error", "single"],
        semi: ["error", "never"],
      },
    },
  ],
};
