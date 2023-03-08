import {
  PhysicsAdapter,
  BaseKinematicController
} from '@webaverse-studios/physics-base'

import {
  Collider,
  ColliderDesc,
  KinematicCharacterController,
  RigidBody,
  RigidBodyDesc,
  Vector3,
  World
} from '@dimforge/rapier3d'

class RapierKinematicController extends BaseKinematicController {
  /**
   * !!! These may not be needed.
   * We might be able to derive the details from the actual rigid body and collider !!!
   */

  /** Character Description */
  characterDescription: RigidBodyDesc
  /** Character Collider Description */
  characterColliderDescription: ColliderDesc

  /** Character Rigid Body */
  character: RigidBody
  /** Character Collider */
  characterCollider: Collider

  /** Character Controller */
  characterController: KinematicCharacterController

  constructor (world: World) {
    super()

    // Create Rigidbody Description
    this.characterDescription =
      RigidBodyDesc.kinematicPositionBased().setTranslation(-10.0, 4.0, -10.0)
    // Create Rigidbody
    this.character = world.createRigidBody(this.characterDescription)

    // Create Collider Description
    this.characterColliderDescription = ColliderDesc.cylinder(1.2, 0.6)
    // Create Collider
    this.characterCollider = world.createCollider(
      this.characterColliderDescription,
      this.character
    )

    // Create Character Controller
    this.characterController = world.createCharacterController(0.1)

    // Autostep if the step height is smaller than 0.7, its width is larger than 0.3,
    // and allow stepping on dynamic bodies.
    this.characterController.enableAutostep(0.7, 0.3, true)

    // Snap to the ground if the vertical distance to the ground is smaller than 0.7.
    this.characterController.enableSnapToGround(0.7)

    // Enable the automatic application of impulses to the dynamic bodies
    // hit by the character along its path.
    this.characterController.setApplyImpulsesToDynamicBodies(true)
  }
}

export class RapierPhysicsAdapter extends PhysicsAdapter {
  world: World
  gravity = new Vector3(0.0, -9.81, 0.0)

  constructor () {
    super()
    this.world = new World(this.gravity)
  }

  get kinematicController () {
    return new RapierKinematicController(this.world)
  }
}
