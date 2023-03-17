/* eslint-disable no-console */

import { Quaternion, Vector3 } from 'three'

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

  /**
   * Velocity of the controller
   *
   * @type {Vector3}
   */
  #velocity

  /**
   * Position of the controller
   *
   * @type {Vector3}
   */
  _position

  /**
   * Rotation of the controller
   *
   * @type {Quaternion}
   */
  _quaternion

  constructor() {
    this.#grounded = false
    this.#velocity = new Vector3()
    this._position = new Vector3()
    this._quaternion = new Quaternion()
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
   * Position of the controller
   *
   * @returns {Vector3} position of the controller
   */
  get position() {
    return this._position
  }

  /**
   * Rotation of the controller
   *
   * @returns {Quaternion} rotation of the controller
   */
  get quaternion() {
    return this._quaternion
  }

  /**
   * Move the kinematic controller in a direction
   *
   * @param {Vector3} desiredTranslation Desired translation for the character
   * @returns {void}
   */
  update( desiredTranslation ) {
    const _ = desiredTranslation
    console.warn( '[KinematicController]: `move` not implemented' )
  }

  /**
   * Destroy the kinematic controller
   */
  destroy() {
    console.warn( '[KinematicController]: `destroy` not implemented' )
  }
}
