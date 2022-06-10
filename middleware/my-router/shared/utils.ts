
export function isMatched(path: string, storedPath: string) {
  return path === storedPath
}

export function match(path: string, storedPath: string) {
  path = removeFirstSlash(path)
  storedPath = removeFirstSlash(storedPath)
  const splitStroedPathes = storedPath.split('/')
  const splitPathes = path.split('/')
  if (splitPathes.length !== splitStroedPathes.length)
    return {
      isMatched: false,
      params: {}
    }

  const len = splitPathes.length
  const params: any = {}
  for (let i = 0; i < len; i++) {
    // TODO 丑陋
    const storedPath = splitStroedPathes[i]
    const path = splitPathes[i]
    if (storedPath.startsWith(':')) {
      params[storedPath.slice(1)] = path
      continue
    } else {
      if (path !== storedPath) {
        return {
          isMatched: false,
          params: {}
        }
      }
    }
  }
  type Params = {
    [K in keyof typeof params]: string
  }
  return {
    isMatched: true,
    params: params as Params
  }
}

export function removeFirstSlash(src: string) {
  return src.replace(/^\//, '')
}

export function removeLastSlash(src: string) {
  return src.replace(/\/$/, '')
}