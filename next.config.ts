/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000", // ✅ Allow images from localhost:8000
      },
    ],
  },
};

module.exports = nextConfig;
