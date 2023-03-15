import { Vector3 } from 'three'

import { Debug } from '@webaverse-studios/debug'

/**
 *
 * Move the controller for the given binding
 *
 * @param {string} binding The binding to move the controller for
 * @this {import('./index').Grid}
 */
export function moveController( binding ) {
  Debug.log( 'moveController', this )
  this._character.applyMovementVector( new Vector3( 1, 0, 0 ))
}
