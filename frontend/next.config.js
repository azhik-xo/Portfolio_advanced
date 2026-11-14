/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const defaultBackend = isProd
  ? 'https://ashik-portfolio-backend.onrender.com'
  : 'http://localhost:5000';
const apiBase = (process.env.NEXT_PUBLIC_API_URL || defaultBackend).replace(/\/+$/, '');

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
        destination: `${apiBase}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

