import m from 'mithril'

/**
 * Patch m.redraw() to update lastTime using a proxy.
 * This allows us to track redraw times during development..
 */

export let lastFrameTime = 0

m.redraw.sync = new Proxy( m.redraw.sync, {
  apply( target, thisArg, args ) {
    lastFrameTime = performance.now()
    return target.apply( thisArg, args )
  },

  get( target, prop ) {
    return target[prop]
  },
  set( target, prop, value ) {
    target[prop] = value
  },
})

m.redraw = new Proxy( m.redraw, {
  apply( target, thisArg, args ) {
    lastFrameTime = performance.now()

    // log the caller
    // FIXME: Doesn't work as desired.
    //console.log( 'm.redraw() called by:', new Error().stack )

    return target.apply( thisArg, args )
  },

  // Pass all other operations to the original m.redraw.
  get( target, prop ) {
    return target[prop]
  },
  set( target, prop, value ) {
    target[prop] = value
  },
})

/**
 * Determine the caller of a function by throwing an error and parsing the
 * stack trace.
 *
 * @returns {string} The name of the function that called the caller.
 */
function _getCaller() {
  try {
    //noinspection ExceptionCaughtLocallyJS
    throw new Error()
  } catch ( e ) {
    // We need to get the grandparent of this function.

    const // Match this function, parent and grandparent.
      allMatches = e.stack.match( /(\w+)@|at (\w+) \(/g ),
      // Match parent function name.
      parentMatches = allMatches[2].match( /(\w+)@|at (\w+) \(/ )

    // Return the name.
    return parentMatches[1] || parentMatches[2]
  }
}
