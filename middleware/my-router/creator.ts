import type {
  Router,
  Method,
  CreatorOption,
  VerbRouteFn,
} from './shared/types'
import type { Middleware } from 'koa'
import { match, removeLastSlash } from './shared/utils'

export function createRouter(option?: CreatorOption) {
  // TODO need a better way to handle optional prefix
  let prefix: string = ''
  if (option) ({ prefix = '' } = option)

  prefix = removeLastSlash(prefix)

  const router = {} as Router
  const routeMap = new Map<string, Map<string, Middleware[]>>()

  function createMethodRoute(verb: Method) {
    // handle del as delete
    if (verb === 'del') verb = 'delete'

    const verbRoute: VerbRouteFn = (path, ...middlewares) => {
      const pathMap = routeMap.get(verb) || new Map()
      const pathHanlders = pathMap.get(`${prefix}/path`) || []
      pathHanlders.push(...middlewares)

      pathMap.set(path, middlewares)
      routeMap.set(verb, pathMap)
    }
    return verbRoute
  }

  const methods: Method[] = ['get', 'post', 'put', 'delete', 'patch', 'del']
  methods.forEach(method => {
    router[method] = createMethodRoute(method)
  })

  router.all = (path, ...middlewares) => {
    methods.forEach(method => createMethodRoute(method)(path, ...middlewares))
  }

  router.routes = () => {
    return async (ctx, next) => {
      let { path, method } = ctx
      method = method.toLowerCase()
      
      const pathMap = routeMap.get(method)
      if (!pathMap) return next()

      for (const [storedPath, handlers] of pathMap.entries()) {
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
  
  router.getRouteMap = () => routeMap
  
  router.use = (basePath,...routers) => {
    routers.forEach(subRouter => {
      const subRouteMap = subRouter.getRouteMap()
      for (const [verb, pathMap] of subRouteMap.entries()) {
        const basePathMap = routeMap.get(verb) || new Map()
        for (const [path, handlers] of pathMap.entries()) {
          const finalPath = `${basePath}${path}`
          const baseHandlers = basePathMap.get(finalPath) || []
          basePathMap.set(finalPath, [...baseHandlers, ...handlers])
        }
        routeMap.set(verb, basePathMap)
      }
    })
  }

  return router
}