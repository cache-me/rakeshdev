import { initClient, type ApiFetcherArgs } from '@ts-rest/core'
import { contract } from '@portfolio/contracts'

/** ISR for successful GETs — keeps homepage fast after the first warm response. */
export const SSR_REVALIDATE_SECONDS = 120
/** Fail fast when Render/DB is hung so TTFB does not sit near 20s. */
const SSR_FETCH_TIMEOUT_MS = 5_000

/**
 * Browser: same-origin `/api` (Next rewrite).
 * Server: hit API_URL directly when set (avoids Vercel→self→Render double hop).
 */
function getApiBaseUrl() {
  if (typeof window !== 'undefined') return '/api'

  const direct = process.env.API_INTERNAL_URL ?? process.env.API_URL

  if (direct) {
    return `${direct.replace(/\/$/, '')}/api`
  }

  const site =
    process.env.NEXT_INTERNAL_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    'http://127.0.0.1:3001'

  return `${site.replace(/\/$/, '')}/api`
}

function serializeRequestBody(body: ApiFetcherArgs['body']): string | undefined {
  if (body === undefined || body === null) return undefined
  if (typeof body === 'string') return body
  return JSON.stringify(body)
}

async function apiFetch(args: ApiFetcherArgs) {
  const url = args.path
  const isServer = typeof window === 'undefined'
  const isGet = args.method.toUpperCase() === 'GET'

  try {
    const response = await fetch(url, {
      method: args.method,
      headers: {
        'Content-Type': 'application/json',
        ...(args.headers ?? {}),
      },
      body: serializeRequestBody(args.body),
      credentials: isServer ? 'omit' : 'include',
      ...(isServer && isGet
        ? {
            next: { revalidate: SSR_REVALIDATE_SECONDS },
            signal: AbortSignal.timeout(SSR_FETCH_TIMEOUT_MS),
          }
        : {
            cache: 'no-store' as const,
            ...(isServer ? { signal: AbortSignal.timeout(SSR_FETCH_TIMEOUT_MS) } : {}),
          }),
    })

    const contentType = response.headers.get('content-type')
    const body = contentType?.includes('application/json')
      ? await response.json()
      : await response.text()

    return { status: response.status, body, headers: response.headers }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[portfolio/web] API fetch failed:', url, error)
    }
    return {
      status: 503,
      body: {
        success: false,
        error: 'API unavailable',
      },
      headers: new Headers(),
    }
  }
}

export const apiClient = initClient(contract, {
  baseUrl: getApiBaseUrl(),
  api: apiFetch,
})

export const adminClient = apiClient.admin

export async function serverFetch<T>(
  fn: () => Promise<{ status: number; body: unknown }>,
): Promise<T | null> {
  const res = await fn()
  if (res.status !== 200) return null
  const body = res.body as { success?: boolean; data?: T }
  if (body.success && body.data !== undefined) return body.data
  return null
}
