abstract class KinematicController {}

/**
 * Rapier Setup:
 * - Create a physics world
 * - Create a rigid body
 * - create collider using the rigid body
 * - create a kinematic controller using rigidBody + collider
 */

/**
 * Base Physics Adapter
 */
export abstract class PhysicsAdapter {
  constructor () {}

  abstract createKinematicController(): KinematicController
}
