import {
  Collider,
  ColliderDesc,
  KinematicCharacterController,
  RigidBody,
  RigidBodyDesc,
  Vector3,
} from '@dimforge/rapier3d-compat'

import { KinematicController as _KinematicController } from '@webaverse-studios/physics-core'

import { PhysicsAdapter } from './PhysicsAdapter'
import { bodyType } from '../bodyType'
import { colliderType } from '../colliderType'

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
   * @param {PhysicsAdapter} ctx Context
   */
  constructor( ctx ) {
    super()

    // TODO: Derive these values from the VRM Avatar
    const { collider, rigidBody } = ctx.createCollider({
      bodyType: bodyType.KINEMATIC_POSITION_BASED,
      colliderType: colliderType.CYLINDER,
      translation: new Vector3( 0, 5, 0 ),
      rotation: new Vector3( 0, 0, 0 ),
      dimensions: {
        halfHeight: 1.2,
        radius: 0.3,
      },
    })

    this.character = rigidBody
    this.characterCollider = collider

    // Create Character Controller
    this.characterController = ctx.world.createCharacterController(
      this.#characterOffset
    )

    // Autostep if the step height is smaller than 0.7,
    // its width is larger than 0.3, and allow stepping on dynamic bodies.
    // ***TODO***
    // his causes weird friction issues with the ground and collider
    // find a way to tweak these values or keep it disabled

    // this.characterController.enableAutostep( 0, 0, false )
    this.characterController.disableAutostep()

    // Snap to the ground if the vertical distance
    // to the ground is smaller than 0.7.
    // this.characterController.enableSnapToGround( 0.7 )

    // Enable the automatic application of impulses to the dynamic bodies
    // hit by the character along its path.
    this.characterController.setApplyImpulsesToDynamicBodies( true )
  }

  /**
   * @override
   */
  destroy() {
    this.characterController.free()
  }

  /**
   * Move Character
   *
   * @override
   * @param {Vector3} desiredTranslation Desired translation for the character
   */
  update( desiredTranslation ) {
    this.characterController.computeColliderMovement(
      this.characterCollider,
      desiredTranslation
    )

    let movement = this.characterController.computedMovement()
    let newPos = this.character.translation()

    newPos.x += movement.x
    newPos.y += movement.y
    newPos.z += movement.z

    this._position = newPos
    this._quaternion = this.character.rotation()
    this.character.setNextKinematicTranslation( newPos )
  }
}
