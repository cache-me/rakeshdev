import type { NextConfig } from 'next'
import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const monorepoRoot = path.join(__dirname, '../..')

loadEnv({ path: path.join(monorepoRoot, '.env') })
loadEnv({ path: path.join(__dirname, '.env') })

const apiUrl = process.env.API_URL ?? 'http://localhost:3000'

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
    return [
      {
        source: '/resume.pdf',
        destination: `${apiUrl}/api/resume/pdf`,
      },
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
