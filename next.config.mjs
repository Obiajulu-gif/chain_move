import path from "path"

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@farcaster/mini-app-solana": path.resolve("lib/shims/empty-module.ts"),
    }
    return config
  },
}

export default nextConfig
