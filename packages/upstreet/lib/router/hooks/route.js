//noinspection ES6RedundantAwait

//import m from 'mithril'
//import { Default } from '#Layouts/Default'


/**
 * Route to and render a component module.
 *
 * @param {string|Array} module - Module name or array of module names.
 * @param {object} opts - Route handling options.
 * @param {object} opts.layout - Layout component
 * @returns {object} - Mithril route object.
 */
export const route = (
  module,
  //{ layout = Default } = {}
) => ({
  // Get appropriate module on match.
  onmatch: async () => {
    if ( Array.isArray( module ))
      return ( await _import( module[0])).default

    return( await _import( module )).default
  },

  // Render using default layout.
  //render: v => m( layout, v )
})


/**
 * Dynamic import wrapper
 */
export const _import = async module => import(
  /* webpackChunkName: "[request]" */
  /* webpackMode: "lazy" */
  /* webpackPrefetch: true */
  `../../../view/pages/${module}/index.js`
)
