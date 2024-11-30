/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['static-cdn.jtvnw.net', 'player.twitch.tv']
  }
};

module.exports = nextConfig;