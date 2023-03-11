import m from 'mithril'
import { route as _ } from './hooks/route'
import { paths } from './paths.js'


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

  // Examples
  [ paths.examples.agent ]: _( 'examples/Agent' ),
  [ paths.examples.input ]: _( 'examples/Input' ),
  [ paths.examples.sea ]: _( 'examples/Sea' ),

  // Redirect 404s to home.
  '/:404...': { onmatch: () => m.route.set( paths.home )}
}
