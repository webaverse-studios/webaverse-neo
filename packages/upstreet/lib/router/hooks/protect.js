//noinspection JSCheckFunctionSignatures

import { route } from './route'


/**
 * Require authentication to view a route.
 */
export const protect = ( module, fallback = '/', ...opts ) => {
  // Get route.
  return route([ module, fallback ], { ...opts, redirect: true })
}
