import type {
  AppRoute,
  AppRouter,
  ServerInferRequest,
  ServerInferResponses,
} from '@ts-rest/core'
import { isAppRoute } from '@ts-rest/core'
import type { Context, Hono } from 'hono'

type HttpStatus = number

export type AppRouteImplementation<T extends AppRoute> = (
  args: ServerInferRequest<T>,
  ctx: { request: Request; responseHeaders: Headers },
) => Promise<ServerInferResponses<T>>

export type RouterImplementation<T extends AppRouter> = {
  [K in keyof T]: T[K] extends AppRouter
    ? RouterImplementation<T[K]>
    : T[K] extends AppRoute
      ? AppRouteImplementation<T[K]>
      : never
}

type LooseHandler = (
  args: Record<string, unknown>,
  ctx: { request: Request; responseHeaders: Headers },
) => Promise<{ status: HttpStatus; body: unknown }>

function joinPath(base: string, path: string): string {
  const b = base.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${b}${p}` || '/'
}

async function parseBody(c: Context): Promise<unknown> {
  const method = c.req.method.toUpperCase()
  if (method === 'GET' || method === 'HEAD' || method === 'DELETE') {
    return undefined
  }
  const contentType = c.req.header('content-type') ?? ''
  if (contentType.includes('application/json')) {
    try {
      return await c.req.json()
    } catch {
      return undefined
    }
  }
  return undefined
}

type ZodLike = {
  safeParse: (v: unknown) => {
    success: boolean
    data?: unknown
    error?: unknown
  }
}

function registerRoute(
  app: Hono,
  route: AppRoute,
  handler: LooseHandler,
  basePath: string,
) {
  const method = route.method.toLowerCase() as
    | 'get'
    | 'post'
    | 'put'
    | 'patch'
    | 'delete'
  const path = joinPath(basePath, route.path)

  app[method](path, async function tsRestRoute(c) {
    const rawParams = c.req.param()
    const rawQuery = c.req.query()
    const rawBody = await parseBody(c)

    let params: unknown = rawParams
    let query: unknown = { ...rawQuery }
    let body: unknown = rawBody

    if (
      route.pathParams &&
      typeof route.pathParams === 'object' &&
      'safeParse' in route.pathParams
    ) {
      const result = (route.pathParams as ZodLike).safeParse(rawParams)
      if (!result.success) {
        return c.json(
          { message: 'Invalid path params', issues: result.error },
          400,
        )
      }
      params = result.data
    }

    if (route.query && typeof route.query === 'object' && 'safeParse' in route.query) {
      const result = (route.query as ZodLike).safeParse(rawQuery)
      if (!result.success) {
        return c.json({ message: 'Invalid query', issues: result.error }, 400)
      }
      query = result.data
    }

    if (
      route.method !== 'GET' &&
      route.method !== 'DELETE' &&
      'body' in route &&
      route.body &&
      typeof route.body === 'object' &&
      'safeParse' in route.body
    ) {
      const result = (route.body as ZodLike).safeParse(rawBody)
      if (!result.success) {
        return c.json({ message: 'Invalid body', issues: result.error }, 400)
      }
      body = result.data
    }

    const headersObj: Record<string, string> = {}
    c.req.raw.headers.forEach((value, key) => {
      headersObj[key] = value
    })

    try {
      const result = await handler(
        { params, query, body, headers: headersObj } as never,
        { request: c.req.raw, responseHeaders: new Headers() },
      )
      return c.json(result.body as Record<string, unknown>, result.status as never)
    } catch {
      return c.json({ message: 'Internal server error' }, 500)
    }
  })
}

function walkRouter(
  app: Hono,
  contract: AppRouter,
  implementation: Record<string, unknown>,
  basePath: string,
) {
  for (const key of Object.keys(contract)) {
    const contractNode = contract[key]
    const implNode = implementation[key]
    if (!contractNode || !implNode) continue

    if (isAppRoute(contractNode)) {
      registerRoute(app, contractNode, implNode as LooseHandler, basePath)
    } else {
      walkRouter(
        app,
        contractNode as AppRouter,
        implNode as Record<string, unknown>,
        basePath,
      )
    }
  }
}

export function createHonoEndpoints<T extends AppRouter>(
  app: Hono,
  contract: T,
  router: RouterImplementation<T>,
  options: { basePath?: string } = {},
) {
  const basePath = options.basePath ?? '/api'
  walkRouter(app, contract, router as unknown as Record<string, unknown>, basePath)
}

export function createRouter<T extends AppRouter>(
  _contract: T,
  router: RouterImplementation<T>,
): RouterImplementation<T> {
  return router
}

export const tsr = {
  router: createRouter,
}
