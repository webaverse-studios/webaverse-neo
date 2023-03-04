import m from 'mithril'
import { route as _ } from './hooks/route'


const
  paths = {
    home: '/',
    sea: '/sea',
  }

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
  [ paths.home ]: _( 'Home' ),
  [ paths.sea ]: _( 'Sea' ),

  // Redirect 404s to home.
  '/:404...': { onmatch: () => m.route.set( paths.home )}
}
