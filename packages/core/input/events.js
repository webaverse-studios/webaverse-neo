import { createEnum } from '@soulofmischief/js-utils'

/**
 * @typedef Events
 * @property {symbol} keyup Keyup event
 * @property {symbol} keydown Keydown event
 * @property {symbol} mouseup Mouseup event
 * @property {symbol} mousedown Mousedown event
 */

/**
 * Events enum
 *
 * @type {Events}
 */
export const events = createEnum( 'keydown', 'keyup', 'mousedown', 'mouseup' )
