import { route as _ } from './hooks/route'


/**
 * Map of paths to dynamically imported components in `src/view/pages`
 *
 * Route types:
 * X - authenticated
 * O - unauthenticated
 * _ - anonymous (unauthenticated-only)
 *
 */
export const routes = {
  // Home
  '/': _( 'Home' ),

  // Redirect 404s to home.
  '/:404...': { onmatch: () => m.route.set( paths.home )}
}
