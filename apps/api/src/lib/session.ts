import { auth } from './auth.js'

const unauthorized = {
  status: 401 as const,
  body: {
    success: false as const,
    error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
  },
}

export async function requireAdminSession(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) {
    return { ok: false as const, response: unauthorized }
  }
  const role = session.user.role as string | null | undefined
  if (role && role !== 'admin') {
    return {
      ok: false as const,
      response: {
        status: 403 as const,
        body: {
          success: false as const,
          error: { code: 'FORBIDDEN', message: 'Admin access required' },
        },
      },
    }
  }
  return { ok: true as const, session }
}
