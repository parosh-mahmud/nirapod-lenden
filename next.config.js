/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");
const nextConfig = {
  reactStrictMode: true, // ✅ Keep this for better development
};

module.exports = {
  i18n,
  nextConfig,
};
