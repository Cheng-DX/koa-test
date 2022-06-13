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
    } else if (storedPath.startsWith('[') && storedPath.endsWith(']')) {
      const number = Number(path)
      if (isNaN(number)) {
        throw new Error(`${path} is not a number`)
      } else {
        params[storedPath.slice(1, -1)] = number
        continue
      }
    } else {
      if (path !== storedPath) {
        return {
          isMatched: false,
          params: {}
        }
      }
    }
  }
  return {
    isMatched: true,
    params
  }
}

export function removeFirstSlash(src: string) {
  return src.replace(/^\//, '')
}

export function removeLastSlash(src: string) {
  return src.replace(/\/$/, '')
}