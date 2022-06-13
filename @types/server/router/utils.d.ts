declare function createPrefixUtil(prefix: string): {
    /**
     * router prefix, init as the function param 'prefix'
     */
    prefix: string;
    /**
     * add prefix for the path
     * @param path path to prefix
     * @returns the path added prefix
     */
    addPrefix: (path: string) => string;
};
export { createPrefixUtil };
