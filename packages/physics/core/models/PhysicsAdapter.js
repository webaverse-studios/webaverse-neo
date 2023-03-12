import { Scene } from '@webaverse-studios/engine-core'
import { KinematicController } from './KinematicController'


/**
 * Base Physics Adapter
 */
export class PhysicsAdapter {
  constructor() {
    // if ( this.constructor === PhysicsAdapter ) {
    //   throw new Error( "Abstract class [`PhysicsAdapter`] can't be instantiated." )
    // }
  }

  /**
   * Construct and return a new Kinematic Controller
   *
   * @returns {KinematicController} - new Kinematic Controller
   */
  createKinematicController() {
    throw new Error( "[`PhysicsAdapter`]: Method 'createKinematicController()' must be implemented." )
  }

  /**
   * Initialize the physics adapter (Wasm, etc.)
   *
   * @returns {Promise<void>}
   */
  async init() {}

  /**
   *
   * @param {Scene} scene - Display debug information onto the scene
   * @returns {void}
   */
  displayDebugInformation( scene ) {
    throw new Error( "[`PhysicsAdapter`]: Method 'displayDebugInformation()' must be implemented." )
  }

  /**
   * Update the physics adapter
   */
  update() {
    throw new Error( "[`PhysicsAdapter`]: Method 'update()' must be implemented." )
  }

  /**
   * Destroy a character controller
   *
   * @param {KinematicController} controller - controller to destroy
   * @returns {void}
   */
  destroyCharacterController( controller ) {
    throw new Error( "[`PhysicsAdapter`]: Method 'destroyCharacterController()' must be implemented." )
  }
}
