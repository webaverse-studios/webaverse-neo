/* eslint-disable no-unused-vars */
import { Scene } from '@webaverse-studios/engine-core'
import { Vector3 } from 'three'


/**
 * Kinematic Controller Class
 */
export class KinematicController {
  /**
   * is the controller grounded?
   *
   * @type {boolean}
   */
  #grounded

  /** @type {Vector3} */
  #velocity

  constructor() {
    // this.grounded = true
    this.#velocity = new Vector3()
  }

  /**
   * Velocity of the controller
   *
   * @returns {Vector3} velocity of the controller
   */
  get velocity() {
    return this.#velocity
  }

  /**
   * @returns {boolean} is the controller grounded?
   */
  get grounded() {
    return this.#grounded
  }

  /**
   * Move the kinematic controller in a direction
   *
   * @param {Vector3} direction - direction to move the controller
   * @returns {void}
   */
  move( direction ) {
    throw new Error( "[`KinematicController`]: Method 'move(direction)' must be implemented." )
  }

  /**
   * Destroy the kinematic controller
   */
  destroy() {}
}
