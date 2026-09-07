/** Site origin for Better Auth (client adds `/api/auth` itself). */
export function getAuthBaseUrl() {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'
  return site.replace(/\/$/, '')
}
