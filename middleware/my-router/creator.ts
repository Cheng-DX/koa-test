import type {
  Router,
  Method,
  CreatorOption,
  RouterMiddleware,
} from './shared/types'
import type { Middleware } from 'koa'
import { match } from './shared/utils'

export function createRouter(option?: CreatorOption) {
  // TODO need a better way to handle optional prefix
  let prefix: string = ''
  if (option)
    ({ prefix = '' } = option)

  // remove the last '/'
  prefix.replace(/\/$/, '')

  const router = {} as Router
  const routeMap = new Map<string, Map<string, Middleware[]>>()

  function createMethodRoute(verb: Method) {
    // handle del as delete
    if (verb === 'del') verb = 'delete'

    return function (path: string, ...middlewares: RouterMiddleware[]) {
      const pathMap = routeMap.get(verb) || new Map()
      const pathHanlders = pathMap.get(`${prefix}/path`) || []
      pathHanlders.push(...middlewares)

      pathMap.set(path, middlewares)
      routeMap.set(verb, pathMap)
    }
  }

  const methods: Method[] = ['get', 'post', 'put', 'delete', 'patch', 'del']
  methods.forEach(method => {
    router[method] = createMethodRoute(method)
  })

  function allFn(path: string, ...middlewares: RouterMiddleware[]) {
    methods.forEach(method => createMethodRoute(method)(path, ...middlewares))
  }
  router.all = allFn

  function routes(): RouterMiddleware {
    return async (ctx, next) => {
      let { path, method } = ctx
      method = method.toLowerCase()

      const pathMap = routeMap.get(method)
      if (!pathMap) return next()
      for (const entry of pathMap.entries()) {
        const [storedPath, handlers] = entry

        const { isMatched, params } = match(path, storedPath)
        if (isMatched) {
          ctx.params = params
          for (const handler of handlers) {
            await handler(ctx, next)
          }
        }
      }
    }
  }
  router.routes = routes
  return router
}