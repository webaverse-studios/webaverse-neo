import {
  init,
  ColliderDesc,
  RigidBodyDesc,
  Vector3,
  World,
} from '@dimforge/rapier3d-compat'

import { Scene } from '@webaverse-studios/engine-core'

import {
  PhysicsAdapter as _PhysicsAdapter
} from '@webaverse-studios/physics-core'

import { BufferAttribute } from 'three'

import { KinematicController } from "./KinematicController.js";


export class PhysicsAdapter extends _PhysicsAdapter {
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
    return new KinematicController( this.world )
  }

  /**
   *
   * @param {KinematicController} controller - Controller to destroy
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
