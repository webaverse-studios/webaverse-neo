import { createEnum } from '@soulofmischief/js-utils'

/**
 * @typedef Events
 * @property {string} keyup Keyup event
 * @property {string} keydown Keydown event
 * @property {string} mouseup Mouseup event
 * @property {string} mousedown Mousedown event
 */

/**
 * Events enum
 *
 * @type {Events}
 */
export const events = createEnum( 'keydown', 'keyup', 'mousedown', 'mouseup' )
