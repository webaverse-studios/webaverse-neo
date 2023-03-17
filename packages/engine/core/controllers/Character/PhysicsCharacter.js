import { Object3D, Vector3 } from 'three'

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
  #speed = 0.05

  /**
   * Movement vector for the character.
   *
   * @type {Vector3}
   */
  #movementVector = new Vector3( 0, -this.#speed, 0 )

  #movingLeft = false
  #movingRight = false

  /**
   * Construct a physics player
   *
   * @param {object} options The options for the character.
   * @param {PhysicsAdapter} options.physicsAdapter The physics adapter to use.
   */
  constructor({ physicsAdapter }) {
    super()

    this.physicsAdapter = physicsAdapter
    this.kinematicController = physicsAdapter.createKinematicController()
  }

  #syncThreeWithPhysics() {
    this.position.copy( this.kinematicController.position )
    this.quaternion.copy( this.kinematicController.quaternion )
  }

  moveForward() {
    this.#movementVector.x = this.#speed
  }

  moveBackward() {
    this.#movementVector.x = -this.#speed
  }

  moveLeft() {
    this.#movingLeft = true
    this.#movementVector.z = -this.#speed
  }

  moveRight() {
    this.#movingRight = true
    this.#movementVector.z = this.#speed
  }

  stopForward() {
    this.#movementVector.x = 0
  }

  stopBackward() {
    this.#movementVector.x = 0
  }

  stopLeft() {
    this.#movingLeft = false

    if ( !this.#movingRight ) {
      this.#movementVector.z = 0
    }
  }

  stopRight() {
    this.#movingRight = false

    if ( !this.#movingLeft ) {
      this.#movementVector.z = 0
    }
  }

  /**
   * Update the character.
   */
  update() {
    this.#syncThreeWithPhysics()
    this.kinematicController.update( this.#movementVector )
  }
}
