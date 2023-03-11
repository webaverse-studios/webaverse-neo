//noinspection ES6RedundantAwait

import m from 'mithril'
import {Default} from '../../../view/layouts/Default.js'
import {getPageComponent} from "./getPageComponent.js";


/**
 * Route to and render a component module.
 *
 * @param {string|Array} page - Module name or array of module names.
 * @param {object} opts - Route handling options.
 * @param {object} opts.layout - Layout component
 * @returns {object} - Mithril route object.
 */
export const route = (
  page,
  { layout = Default } = {}
) => ({
  // Get appropriate module on match.
  onmatch: async () => {
    // Only use the first page of an array.
    const _page = Array.isArray( page )
      ? page[0]
      : page

    return getPageComponent( _page )
  },

  // Render using default layout.
  render: v => m( layout, v )
})


