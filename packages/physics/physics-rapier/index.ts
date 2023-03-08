import { PhysicsAdapter } from '@webaverse-studios/physics-base'

import {
  Collider,
  ColliderDesc,
  KinematicCharacterController,
  RigidBody,
  RigidBodyDesc,
  Vector3,
  World
} from '@dimforge/rapier3d'

export class RapierPhysicsAdapter extends PhysicsAdapter {
  world: World
  gravity = new Vector3(0.0, -9.81, 0.0)

  // Character Description
  characterDescription: RigidBodyDesc | undefined
  characterColliderDescription: ColliderDesc | undefined

  character: RigidBody | undefined
  characterCollider: Collider | undefined

  characterController: KinematicCharacterController | undefined

  constructor () {
    super()

    this.world = new World(this.gravity)
  }

  createKinematicController (): void {
    // Create Rigidbody Description
    this.characterDescription =
      RigidBodyDesc.kinematicPositionBased().setTranslation(-10.0, 4.0, -10.0)
    // Create Rigidbody
    this.character = this.world.createRigidBody(this.characterDescription)

    // Create Collider Description
    this.characterColliderDescription = ColliderDesc.cylinder(1.2, 0.6)
    // Create Collider
    this.characterCollider = this.world.createCollider(
      this.characterColliderDescription,
      this.character
    )

    // Create Character Controller
    this.characterController = this.world.createCharacterController(0.1)

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
