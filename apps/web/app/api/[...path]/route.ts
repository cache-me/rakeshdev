import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const HOP_BY_HOP = new Set([
  'connection',
  'content-length',
  'host',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
])

function backendBase() {
  const base =
    process.env.API_INTERNAL_URL ?? process.env.API_URL ?? 'http://127.0.0.1:3000'
  return base.replace(/\/$/, '')
}

async function proxyRequest(req: NextRequest, pathSegments: string[]) {
  const target = `${backendBase()}/api/${pathSegments.map(encodeURIComponent).join('/')}${req.nextUrl.search}`

  const headers = new Headers()
  req.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) headers.set(key, value)
  })

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: 'manual',
    cache: 'no-store',
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.arrayBuffer()
  }

  let upstream: Response
  try {
    upstream = await fetch(target, init)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upstream unreachable'
    return Response.json(
      {
        success: false,
        error: {
          code: 'API_UNAVAILABLE',
          message: `Backend proxy failed (${backendBase()}): ${message}`,
        },
      },
      { status: 502 },
    )
  }

  const out = new Headers()
  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    if (lower === 'transfer-encoding') return
    if (lower === 'set-cookie') return
    out.set(key, value)
  })

  const getSetCookie = (
    upstream.headers as Headers & { getSetCookie?: () => string[] }
  ).getSetCookie
  if (typeof getSetCookie === 'function') {
    for (const cookie of getSetCookie.call(upstream.headers)) {
      out.append('set-cookie', cookie)
    }
  } else {
    const single = upstream.headers.get('set-cookie')
    if (single) out.append('set-cookie', single)
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: out,
  })
}

type Ctx = { params: Promise<{ path: string[] }> }

async function handle(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params
  if (!path?.length) {
    return Response.json(
      { success: false, error: { code: 'BAD_PATH', message: 'Missing API path' } },
      { status: 400 },
    )
  }
  return proxyRequest(req, path)
}

export const GET = handle
export const POST = handle
export const PUT = handle
export const PATCH = handle
export const DELETE = handle
export const OPTIONS = handle
export const HEAD = handle
