import { KinematicController, PhysicsAdapter } from '@webaverse-studios/physics-core'
import { Object3D, Vector3 } from 'three'

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
   *
   * @param {object} options - The options for the character.
   * @param {PhysicsAdapter} options.physicsAdapter - The physics adapter to use.
   */
  constructor({ physicsAdapter }) {
    super()

    this.physicsAdapter = physicsAdapter
    this.kinematicController = physicsAdapter.createKinematicController()
  }

  /**
   * Update the character.
   *
   * @param {Vector3} direction - The direction to move the character.
   * @instance
   */
  update( direction ) {
    this.kinematicController.move( direction )
  }
}
