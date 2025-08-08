/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@claudia-blog/ui', '@claudia-blog/database'],
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3'],
  }
}

module.exports = nextConfig
