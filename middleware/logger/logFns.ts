import consola from 'consola'

export function warn(msg: string) {
  consola.warn(msg)
}

export function error(msg: string) {
  consola.error(msg)
}

export function success(msg: string) {
  consola.success(msg)
}

export function log(msg: string) {
  consola.log(msg)
}