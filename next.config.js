/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['images.unsplash.com', 'static-cdn.jtvnw.net']
  },
  experimental: {
    swcLoader: true,
    swcMinify: true,
    forceSwcTransforms: true
  }
};

module.exports = nextConfig;