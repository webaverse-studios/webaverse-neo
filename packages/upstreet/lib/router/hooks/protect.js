//noinspection JSCheckFunctionSignatures

import { route } from './route'

/**
 * Require authentication to view a route.
 *
 * @param {string|Array<string>} module The route to protect.
 * @param {string} fallback The route to redirect to if not authenticated.
 * @param {...any} opts Additional options to pass to the route resolver.
 * @returns {import('mithril').RouteResolver} The route resolver.
 */
export const protect = ( module, fallback = '/', ...opts ) => {
  // Get route.
  return route([module, fallback], { ...opts, redirect: true })
}
