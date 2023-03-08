/**
 * Rapier Setup:
 * - Create a physics world
 * - Create a rigid body
 * - create collider using the rigid body
 * - create a kinematic controller using rigidBody + collider
 */

/**
 * Base Kinematic Controller Class
 */
export class BaseKinematicController {}

/**
 * Base Physics Adapter
 */
export abstract class PhysicsAdapter {
  constructor () {}

  /**
   * Construct and return a new Kinematic Controller
   */
  get kinematicController () {
    return new BaseKinematicController()
  }
}
