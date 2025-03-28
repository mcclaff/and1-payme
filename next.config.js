/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,  // Add trailing slashes for Netlify compatibility
  images: {
    unoptimized: true,  // Important for Netlify static deployment
  },
  output: 'export',  // Generate static HTML files
};

module.exports = nextConfig; 