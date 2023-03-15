/**
 * Get a page component from a partial page path.
 *
 * @param {string} page Partial page path.
 * @returns {Promise<*>} The page component.
 */
export function getPageComponent( page ) {
  return components[`../../../view/pages/${page}/index.js`]
}

// Glob import and resolve all page components.
const modules = import.meta.glob( `../../../view/pages/**/index.js` ),
  components = Object.fromEntries(
    Object.entries( modules ).map(([path, module]) => [
      path,
      getComponentFromModule( module ),
    ])
  )

/**
 * Get a component from a module.
 *
 * @param {Function} module The module to get the component from.
 */
async function getComponentFromModule( module ) {
  return ( await module()).default
}
