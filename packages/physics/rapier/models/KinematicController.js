import {
  Collider,
  ColliderDesc,
  KinematicCharacterController,
  RigidBody,
  RigidBodyDesc,
  Vector3,
  World,
} from '@dimforge/rapier3d-compat'

import { KinematicController as _KinematicController } from '@webaverse-studios/physics-core'

export class KinematicController extends _KinematicController {
  /**
   * These may not be needed. We might be able to derive the details
   * from the actual rigid body and collider
   */

  /**
   * Character Description
   *
   * @type {RigidBodyDesc}
   */
  characterDescription

  /**
   * Character Collider Description
   *
   * @type {ColliderDesc}
   */
  characterColliderDescription

  /**
   * Character Rigid Body
   *
   * @type {RigidBody}
   */
  character
  /**
   * Character Collider
   *
   * @type {Collider}
   */
  characterCollider

  /**
   * Character Controller
   *
   * @type {KinematicCharacterController}
   */
  characterController

  /**
   * The gap the controller will leave between the character
   * and its environment.
   *
   * @type {number}
   */
  #characterOffset = 0.1

  /**
   * Create Kinematic Controller
   *
   * @param {World} world Rapier Physics World
   */
  constructor( world ) {
    super()

    // Create Rigidbody Description
    this.characterDescription =
      RigidBodyDesc.kinematicPositionBased().setTranslation( -10.0, 4.0, -10.0 )
    // Create Rigidbody
    this.character = world.createRigidBody( this.characterDescription )

    // Create Collider Description
    this.characterColliderDescription = ColliderDesc.cylinder( 1.2, 0.6 )
    // Create Collider
    this.characterCollider = world.createCollider(
      this.characterColliderDescription,
      this.character
    )

    // Create Character Controller
    // eslint-disable-next-line max-len
    this.characterController = world.createCharacterController(
      this.#characterOffset
    )

    // Autostep if the step height is smaller than 0.7,
    // its width is larger than 0.3, and allow stepping on dynamic bodies.
    this.characterController.enableAutostep( 0.7, 0.3, true )

    // Snap to the ground if the vertical distance
    // to the ground is smaller than 0.7.
    this.characterController.enableSnapToGround( 0.7 )

    // Enable the automatic application of impulses to the dynamic bodies
    // hit by the character along its path.
    this.characterController.setApplyImpulsesToDynamicBodies( true )
  }

  destroy() {
    this.characterController.free()
  }

  /**
   * Move Character
   *
   * @param {Vector3} direction direction to move the character
   */
  move( direction ) {
    this.characterController.computeColliderMovement(
      this.characterCollider,
      direction
    )

    let movement = this.characterController.computedMovement()
    let newPos = this.character.translation()
    newPos.x += movement.x
    newPos.y += movement.y
    newPos.z += movement.z
    this.character.setNextKinematicTranslation( newPos )

    // eslint-disable-next-line no-console
    console.log( this.characterController.computedMovement())
  }
}
