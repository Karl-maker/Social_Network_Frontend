/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
    REFRESH_KEYS: process.env.REFRESH_KEYS,
    ACCESS_KEYS: process.env.ACCESS_KEYS,
    DB_URI: process.env.DB_URI,
  },
};

module.exports = nextConfig;
