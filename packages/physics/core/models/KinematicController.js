/* eslint-disable no-console */

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
   * Is the controller grounded?
   *
   * @returns {boolean} is the controller grounded?
   */
  get grounded() {
    return this.#grounded
  }

  /**
   * Move the kinematic controller in a direction
   *
   * @param {Vector3} direction direction to move the controller
   * @returns {void}
   */
  move( direction ) {
    const _ = direction
    console.warn( '[KinematicController]: `move` not implemented' )
  }

  /**
   * Destroy the kinematic controller
   */
  destroy() {
    console.warn( '[KinematicController]: `destroy` not implemented' )
  }
}
