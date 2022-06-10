import { type Middleware } from 'koa'
import {
  warn, error, success
} from './logFns'

const logger: Middleware = async (ctx, next) => {
  const start = new Date()
  try {
    await next()
  } catch (e) {
    error(`${ctx.method} ${ctx.url} ${e}`)
  }

  const end = new Date()
  const duration = end.getTime() - start.getTime()
  if (ctx.status >= 400) {
    error(`${ctx.method} ${ctx.url} ${ctx.status} ${duration}ms`)
    return
  }
  if (duration >= 400) {
    warn('This request cost over 400ms')
  }
  success(`${ctx.method} ${ctx.url} - ${duration} ms`)
}

export default logger