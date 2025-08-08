/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@100lesme-blog/ui', '@100lesme-blog/database'],
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
