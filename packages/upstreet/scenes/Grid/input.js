import { Debug } from '@webaverse-studios/debug'
import { AvatarCharacter } from '@webaverse-studios/engine-nyx'
import { events } from '@webaverse-studios/input'

/**
 *
 * Move the controller for the given binding
 *
 * @param {object} params The parameters for the move controller function
 * @param {string} params.binding The binding to move the controller for
 * @param {KeyboardEvent} params.event The keyboard event
 * @this {import('./index').Grid}
 */
export function moveController({ event, binding }) {
  Debug.log( event, binding )

  if ( event.type === events.keydown.description ) {
    keydown( this._character, binding )
  } else {
    keyup( this._character, binding )
  }
}

/**
 * Keydown handler
 *
 * @param {import('@webaverse-studios/engine-nyx').AvatarCharacter} character
 * @param {string} binding The binding to move the controller for
 */
function keydown( character, binding ) {
  switch ( binding ) {
    case 'KeyW':
      character.moveForward()
      break
    case 'KeyA':
      character.moveLeft()
      break
    case 'KeyS':
      character.moveBackward()
      break
    case 'KeyD':
      character.moveRight()
      break
  }
}

/**
 * Keyup handler
 *
 * @param {import('@webaverse-studios/engine-nyx').AvatarCharacter} character
 * @param {string} binding The binding to move the controller for
 */
function keyup( character, binding ) {
  switch ( binding ) {
    case 'KeyW':
      character.stopForward()
      break
    case 'KeyA':
      character.stopLeft()
      break
    case 'KeyS':
      character.stopBackward()
      break
    case 'KeyD':
      character.stopRight()
      break
  }
}
