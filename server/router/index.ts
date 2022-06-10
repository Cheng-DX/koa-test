import KoaRouter from 'koa-router'
import applyRoutes from './allRoutes'

const router = new KoaRouter()
applyRoutes(router)

const routes = router.routes()

export {
  router,
  routes
}