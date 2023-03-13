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

  /**
   * Update the character.
   *
   * @instance
   * @param {Vector3} direction The direction to move the character.
   */
  update( direction ) {
    this.kinematicController.move( direction )
  }
}
