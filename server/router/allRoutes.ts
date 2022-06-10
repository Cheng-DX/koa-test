import { createPrefixUtil } from './utils'
import KoaRouter from 'koa-router'

function applyRoutes(router: KoaRouter) {
  const {
    prefix,
    addPrefix
  } = createPrefixUtil('/api')
  router.prefix(prefix)

  // router.verb
  router.get('/test', (ctx, next) => {
    console.log('test request context:\n', ctx)
    ctx.body = 'hello world'
    next()
  })

  router.post('/post', (ctx, next) => {
    console.log('\n\npost request context:\n', ctx)
    ctx.body = 'a post request'
    next()
  })

  // router.all
  router.all('/all', (ctx, next) => {
    const { method } = ctx
    ctx.body = `a(n) ${method} request`
    console.log('in ALL all')
    next()
  })

  router.get('/all', (ctx, next) => {
    ctx.body = `in GET request`
    console.log('in GET all')
    next()
  })

  // params in named router
  router.get('named', '/named/:id', (ctx, next) => {
    const { params } = ctx
    console.log('in named route: params:', params)
    next()
  })

  const path = router.url('named', { id: 1 })

  // mutiple middlewares
  router.get('/multiple', async (ctx, next) => {
    console.log('middleware 1')
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log('in timeout')
        resolve('this')
      }, 1000)
      console.log('in promise')
    })
    next()
  }
    , (ctx, next) => {
      console.log('middleware 2')
      ctx.body = 'multiple middlewares'
      next()
    })

  // router.redirect
  router.redirect('/redirect', addPrefix('/all'))

  // redirect by all
  router.all('/redirect-all', (ctx, next) => {
    ctx.redirect(addPrefix('/all'))
    ctx.status = 301
    next()
  })

  // nested router
  const subRouter = new KoaRouter()
  subRouter.get('/sub', (_, next) => {
    console.log('in sub router')
    next()
  })

  router.use('/sub-root', subRouter.routes())
}

export default applyRoutes
