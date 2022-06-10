import { type Middleware } from "koa"
import { RouterParams } from "./paramTypes"


export interface CreatorOption {
  /**
   * prefix of all routes' path
   */
  prefix?: string
}

export type Method = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'del'

export type VerbRouteFn = <Path extends string>(path: Path, ...middlewares: RouterMiddleware<Path>[]) => any

export type VerbRouteFns = {
  [M in Method]: VerbRouteFn
}

export type Router = {
  all: VerbRouteFn
  routes: () => RouterMiddleware<any>
} & VerbRouteFns

/**
 * It looks a little weird but useful 🤣
 */
export type AddTypeToFirstParam<F extends (p1: any, ...last: any[]) => any, T> =
  F extends (p1: infer P1, ...last: (infer U)[]) => any ? (p1: P1 & T, ...last: U[]) => any : never

export type RouterMiddleware<Path extends string> = AddTypeToFirstParam<Middleware, RouterParams<Path>>

