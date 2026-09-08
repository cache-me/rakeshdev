import type { NextConfig } from 'next'
import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const monorepoRoot = path.join(__dirname, '../..')

loadEnv({ path: path.join(monorepoRoot, '.env') })
loadEnv({ path: path.join(__dirname, '.env') })

const nextConfig: NextConfig = {
  // Standalone is for Docker self-host; Vercel uses its own output pipeline.
  ...(process.env.VERCEL ? {} : { output: 'standalone' as const }),
  outputFileTracingRoot: path.join(__dirname, '../..'),
  transpilePackages: ['@portfolio/contracts', '@portfolio/types', '@portfolio/validation'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async rewrites() {
    // Browser /api/* is handled at runtime by app/api/[...path] (reads API_URL from env).
    // Keep resume.pdf as an internal rewrite into that proxy.
    return [
      {
        source: '/resume.pdf',
        destination: '/api/resume/pdf',
      },
    ]
  },
}

export default nextConfig
