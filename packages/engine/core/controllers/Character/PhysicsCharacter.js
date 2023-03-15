import { Euler, Object3D, Vector3 } from 'three'

import { Debug } from '@webaverse-studios/debug'
import {
  KinematicController,
  PhysicsAdapter,
} from '@webaverse-studios/physics-core'

/**
 * @class Physics Character
 */
export class PhysicsCharacter extends Object3D {
  /**
   * Running physics adapter.
   *
   * @type {PhysicsAdapter}
   */
  physicsAdapter

  /**
   * Kinematic controller for the character.
   *
   * @type {KinematicController}
   */
  kinematicController

  /**
   * Speed of the character.
   *
   * @type {number}
   */
  #speed = 0.1

  /**
   * Movement vector for the character.
   *
   * @type {Vector3}
   */
  #movementVector = new Vector3( 0, -1, 0 )

  /**
   * Construct a physics player
   *
   * @param {object} options The options for the character.
   * @param {PhysicsAdapter} options.physicsAdapter The physics adapter to use.
   */
  constructor({ physicsAdapter }) {
    super()

    console.log( physicsAdapter )
    // this.#movementVector = physicsAdapter.gravity
    this.physicsAdapter = physicsAdapter
    this.kinematicController = physicsAdapter.createKinematicController()
  }

  #syncThreeWithPhysics() {
    this.position.copy( this.kinematicController.position )
    this.rotation.copy(
      new Euler(
        this.kinematicController.rotation.x,
        this.kinematicController.rotation.y,
        this.kinematicController.rotation.z
      )
    )
  }

  applyMovementVector( movementVector ) {
    this.#movementVector.add( movementVector )
  }

  /**
   * Update the character.
   */
  update() {
    this.#syncThreeWithPhysics()
    this.kinematicController.move( this.#movementVector )
  }
}
