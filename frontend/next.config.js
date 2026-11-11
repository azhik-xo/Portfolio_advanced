/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/home',
        destination: '/',
      },
      {
        source: '/work',
        destination: '/',
      },
      {
        source: '/my-story',
        destination: '/',
      },
      {
        source: '/about',
        destination: '/',
      },
      {
        source: '/contact',
        destination: '/',
      },
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
          : 'http://localhost:5000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

