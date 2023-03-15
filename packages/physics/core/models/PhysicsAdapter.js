/* eslint-disable max-len */
/* eslint-disable no-console */

import { LineSegments, Vector3 } from 'three'

import { KinematicController } from './KinematicController'

/** TODO: Move this into a utils lib :) @cosmos */

/**
 * Inline Parameters so eslint doesn't complain about unused variables
 *
 * @param {...any} params Parameters to inline
 */
function inlineParameters( ...params ) {
  const _ = params
}

/**
 * Base Physics Adapter
 */
export class PhysicsAdapter {
  constructor() {}

  /**
   * Construct and return a new Kinematic Controller
   *
   * @returns {KinematicController} - new Kinematic Controller
   */
  createKinematicController() {
    console.warn(
      ```
      [PhysicsAdapter]: \`createKinematicController\` not implemented.
      Using default dummy controller.
      ```
    )
    return new KinematicController()
  }

  /**
   * Initialize the physics adapter (Wasm, etc.)
   *
   * @returns {Promise<void>}
   */
  async init() {}

  /**
   * Create a collider for a rigid-body
   *
   * @param {object} colliderParams Collider parameters
   * @param {string} colliderParams.bodyType Rigid-body type
   * @param {string} colliderParams.colliderType Collider type
   * @param {Vector3} colliderParams.translation Translation
   * @param {Vector3} colliderParams.rotation Rotation
   * @param {object} colliderParams.dimensions Collider dimensions
   * @returns {object} Generated collider
   */
  async createCollider( colliderParams ) {
    inlineParameters( colliderParams )
    console.warn( '[PhysicsAdapter]: `createCollider` not implemented' )
  }

  /**
   * Update the physics adapterimport { Scene } from '@webaverse-studios/engine-core'
   
   *
   * @param {KinematicController} controller controller to destroy
   * @returns {void}
   */
  destroyCharacterController( controller ) {
    const _ = controller
    console.warn(
      '[PhysicsAdapter]: `destroyCharacterController` not implemented'
    )
  }

  /**
   * Display Debug Information
   *
   * @param {LineSegments} lines LineSegments to add debug information to
   * @returns {void}
   */
  displayDebugInformation( lines ) {
    const _ = lines
    console.warn(
      '[PhysicsAdapter]: `displayDebugInformation` not implemented'
    )
  }
}
