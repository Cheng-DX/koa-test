function createPrefixUtil(prefix: string) {
  prefix = prefix.startsWith('/') ? prefix : `/${prefix}`
  const prefixUtil = {
    /**
     * router prefix, init as the function param 'prefix'
     */
    prefix,
    /**
     * add prefix for the path
     * @param path path to prefix 
     * @returns the path added prefix
     */
    addPrefix: (path: string) => {
      path = path.startsWith('/') ? path : `/${path}`
      return `${prefixUtil.prefix}${path}`
    }
  }

  return prefixUtil
}

export { createPrefixUtil }