/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@daily-mission/api',
    '@daily-mission/app',
    '@daily-mission/ui',
  ],
}

module.exports = nextConfig
