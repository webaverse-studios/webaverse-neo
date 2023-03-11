import { PhysicsAdapter, KinematicController } from '@webaverse-studios/physics-core'

import {
  init,
  Collider,
  ColliderDesc,
  KinematicCharacterController,
  RigidBody,
  RigidBodyDesc,
  Vector3,
  World,
} from '@dimforge/rapier3d-compat'
import { BufferAttribute } from 'three'
import { Scene } from '../../engines/engine-core/scene'

/**
 * Rapier Setup:
 * - Create a physics world
 * - Create a rigid body
 * - create collider using the rigid body
 * - create a kinematic controller using rigidBody + collider
 */
class RapierKinematicController extends KinematicController {
  /**
   * !!! These may not be needed.
   * We might be able to derive the details from the actual rigid body and collider !!!
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
   * The gap the controller will leave between the character and its environment.
   *
   * @type {number}
   */
  #characterOffset = 0.1

  /**
   * @param {World} world - Rapier Physics World
   */
  constructor( world ) {
    super()

    // Create Rigidbody Description
    this.characterDescription = RigidBodyDesc.kinematicPositionBased().setTranslation( -10.0, 4.0, -10.0 )
    // Create Rigidbody
    this.character = world.createRigidBody( this.characterDescription )

    // Create Collider Description
    this.characterColliderDescription = ColliderDesc.cylinder( 1.2, 0.6 )
    // Create Collider
    this.characterCollider = world.createCollider( this.characterColliderDescription, this.character )

    // Create Character Controller
    this.characterController = world.createCharacterController( this.#characterOffset )

    // Autostep if the step height is smaller than 0.7, its width is larger than 0.3,
    // and allow stepping on dynamic bodies.
    this.characterController.enableAutostep( 0.7, 0.3, true )

    // Snap to the ground if the vertical distance to the ground is smaller than 0.7.
    this.characterController.enableSnapToGround( 0.7 )

    // Enable the automatic application of impulses to the dynamic bodies
    // hit by the character along its path.
    this.characterController.setApplyImpulsesToDynamicBodies( true )
  }

  destroy() {
    this.characterController.free()
  }

  /**
   *
   * @param {Vector3} direction - direction to move the character
   */
  move( direction ) {
    this.characterController.computeColliderMovement( this.characterCollider, direction )

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

export class RapierPhysicsAdapter extends PhysicsAdapter {
  /**
   * Physics World
   *
   * @type {World}
   */
  world

  gravity = new Vector3( 0.0, -9.81, 0.0 )

  constructor() {
    super()
  }

  async init() {
    await init()

    this.world = new World( this.gravity )

    // Create Ground.
    let bodyDesc = RigidBodyDesc.fixed()
    let body = this.world.createRigidBody( bodyDesc )
    let colliderDesc = ColliderDesc.cuboid( 15.0, 0.1, 15.0 )
    this.world.createCollider( colliderDesc, body )
  }

  update() {
    // Advance the simulation by one time step.
    this.world.step()
  }

  createKinematicController() {
    return new RapierKinematicController( this.world )
  }

  /**
   *
   * @param {RapierKinematicController} controller - Controller to destroy
   */
  destroyCharacterController( controller ) {
    this.world.removeCharacterController( controller.characterController )
  }

  /**
   *
   * @param {Scene} scene - Scene to add debug information to
   */
  displayDebugInformation( scene ) {
    const buffers = this.world.debugRender()
    scene.debugLines.geometry.setAttribute( 'position', new BufferAttribute( buffers.vertices, 3 ))
    scene.debugLines.geometry.setAttribute( 'color', new BufferAttribute( buffers.colors, 4 ))
  }
}
