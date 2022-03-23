/** @type {import('next').NextConfig} */
const withImages = require('next-images')

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
}
module.exports = withImages()
module.exports = nextConfig
