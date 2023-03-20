import { events } from '@webaverse-studios/input'
import { Collider, RigidBody } from '@webaverse-studios/physics-rapier'

/**
 *
 * Move the controller for the given binding
 *
 * @param {KeyboardEvent} event The keyboard event
 * @this {import('./index').Grid}
 */
export function moveController( event ) {
  if ( event.type === events.keydown.description ) {
    keydown( this._terrain, event )
  }
}

const INCREMENT = 0.01

/**
 * Keydown handler
 *
 * @param {{collider: Collider, rigidBody: RigidBody}} terrain Character Controller
 * @param {KeyboardEvent} event The binding to move the controller for
 */
function keydown( terrain, event ) {
  const newRot = terrain.rigidBody.rotation()
  switch ( event.code ) {
    case 'KeyW':
      newRot.x -= INCREMENT
      break
    case 'KeyA':
      newRot.z += INCREMENT
      break
    case 'KeyS':
      newRot.x += INCREMENT
      break
    case 'KeyD':
      newRot.z -= INCREMENT
      break
  }

  newRot.x = parseFloat( newRot.x.toFixed( 2 ))
  newRot.z = parseFloat( newRot.z.toFixed( 2 ))
  console.log( newRot )

  terrain.rigidBody.setRotation( newRot, true )
}
