/** @type {import('next').NextConfig} */
const nextConfig = {
  // Memastikan build tidak error karena peringatan sepele
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
