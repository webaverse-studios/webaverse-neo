import { Object3D, Vector3 } from 'three'

/**
 * @class Physics Character
 */
export class PhysicsCharacter extends Object3D {
  /**
   * Velocity of the character.
   *
   * @property {Vector3}
   */
  velocity: Vector3

  //   characterController: KinematicCharacterController

  /**
   * The gap the controller will leave between the character and its environment.
   */
  characterOffset: number = 0.1

  constructor () {
    super()

    this.velocity = new Vector3()
  }
}
