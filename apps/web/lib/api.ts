import { initClient, type ApiFetcherArgs } from '@ts-rest/core'
import { contract } from '@portfolio/contracts'

/**
 * Browser: same-origin `/api` (Next rewrite).
 * Server: prefer the public site URL so requests go through Next rewrites; optional
 * `API_INTERNAL_URL` for direct API access in production.
 */
function getApiBaseUrl() {
  if (typeof window !== 'undefined') return '/api'

  const direct =
    process.env.API_INTERNAL_URL ??
    (process.env.API_SSR_DIRECT === 'true' ? process.env.API_URL : undefined)

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
  // @ts-rest/core already JSON.stringify's object bodies before calling the fetcher.
  if (typeof body === 'string') return body
  return JSON.stringify(body)
}

async function apiFetch(args: ApiFetcherArgs) {
  const url = args.path

  try {
    const response = await fetch(url, {
      method: args.method,
      headers: {
        'Content-Type': 'application/json',
        ...(args.headers ?? {}),
      },
      body: serializeRequestBody(args.body),
      credentials: 'include',
      cache: 'no-store',
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
