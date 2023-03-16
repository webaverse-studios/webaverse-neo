import {
  ColliderDesc,
  RigidBodyDesc,
  Vector3,
  World,
} from '@dimforge/rapier3d-compat'
import {
  BoxGeometry,
  BufferAttribute,
  CapsuleGeometry,
  ConeGeometry,
  CylinderGeometry,
  Euler,
  LineSegments,
  Mesh,
  MeshPhongMaterial,
  Quaternion,
  SphereGeometry,
} from 'three'

import { PhysicsAdapter as _PhysicsAdapter } from '@webaverse-studios/physics-core'

import { KinematicController } from './KinematicController'
import { bodyType as bt } from '../bodyType'
import { colliderType as ct } from '../colliderType'
import { getRapier } from '../lib'

/**
 * @typedef {import('../bodyType').BodyType} BodyType
 * @typedef {import('../colliderType').ColliderType} ColliderType
 */

/**
 * @typedef {object} DimensionOptions
 * @property {number} [height] Height
 * @property {number} [radius] Radius
 * @property {number} [hx] Height x dimension
 * @property {number} [hy] Height y dimension
 * @property {number} [hz] Height z dimension
 * @property {number} [halfHeight] Half height
 */

/**
 * @typedef {object} MeshOptions
 * @property {string} [color] Color of Mesh
 */

export class PhysicsAdapter extends _PhysicsAdapter {
  /**
   * Physics World
   *
   * @type {World}
   */
  world

  /**
   * Gravity of the world
   */
  gravity = new Vector3( 0.0, -9.81, 0.0 )

  constructor() {
    super()
  }

  async init() {
    await getRapier()
    this.world = new World( this.gravity )
  }

  update() {
    // Advance the simulation by one time step.
    this.world.step()
  }

  createKinematicController() {
    let ctx = this
    return new KinematicController( ctx )
  }

  /**
   * Destroy Character Controller
   *
   * @param {KinematicController} controller ControlRigidBody
   */
  destroyCharacterController( controller ) {
    this.world.removeCharacterController( controller.characterController )
  }

  /**
   * Display Debug Information
   *
   * @param {LineSegments} lines LineSegments to add debug information to
   */
  displayDebugInformation( lines ) {
    const buffers = this.world.debugRender()
    lines.visible = true
    lines.geometry.setAttribute(
      'position',
      new BufferAttribute( buffers.vertices, 3 )
    )
    lines.geometry.setAttribute(
      'color',
      new BufferAttribute( buffers.colors, 4 )
    )
  }

  /**
   * @typedef {object} ColliderReturn
   * @property {Mesh} mesh Generated THREE.Mesh
   * @property {import('@dimforge/rapier3d-compat').Collider} collider Generated Collider
   * @property {import('@dimforge/rapier3d-compat').RigidBody} rigidBody Generated Rigid-body
   * Generated Rigid-body
   */

  /**
   * Create a collider for a rigid-body
   *
   * @param {object} params Collider parameters
   * @param {BodyType} params.bodyType Rigid-body type
   * @param {string} params.colliderType Collider type
   * @param {Vector3} params.translation Translation
   * @param {Vector3} params.rotation Rotation
   * @param {DimensionOptions} params.dimensions Collider dimensions
   * @param {import('three').MeshPhongMaterialParameters} params.meshOptions
   * Mesh options
   * @returns {ColliderReturn} Generated collider
   */
  createCollider({
    bodyType,
    colliderType,
    translation,
    rotation,
    dimensions,
    meshOptions,
  }) {
    const bodyDesc = (() => {
      switch ( bodyType ) {
        case bt.FIXED: {
          const body = RigidBodyDesc.fixed()
          body.setCanSleep( true )
          return body
        }
        case bt.DYNAMIC: {
          return RigidBodyDesc.dynamic()
        }
        case bt.KINEMATIC_VELOCITY_BASED: {
          return RigidBodyDesc.kinematicVelocityBased()
        }
        case bt.KINEMATIC_POSITION_BASED: {
          return RigidBodyDesc.kinematicPositionBased()
        }
        default: {
          throw new Error(
            `Unknown body type: ${
              bodyType.description || bodyType.toString()
            }`
          )
        }
      }
    })()

    if ( translation )
      bodyDesc.setTranslation( translation.x, translation.y, translation.z )

    if ( rotation ) {
      const q = new Quaternion().setFromEuler(
        new Euler( rotation.x, rotation.y, rotation.z, 'XYZ' )
      )
      bodyDesc.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w })
    }

    const rigidBody = this.world.createRigidBody( bodyDesc )

    const colliderDesc = (() => {
      switch ( colliderType ) {
        case ct.CUBOID: {
          return ColliderDesc.cuboid(
            dimensions.hx,
            dimensions.hy,
            dimensions.hz
          )
        }
        case ct.CYLINDER: {
          return ColliderDesc.cylinder(
            dimensions.halfHeight,
            dimensions.radius
          )
        }
        case ct.BALL: {
          return ColliderDesc.ball( dimensions.radius )
        }
        case ct.CAPSULE: {
          return ColliderDesc.capsule(
            dimensions.halfHeight,
            dimensions.radius
          )
        }
        case ct.CONE: {
          const cone = ColliderDesc.cone( dimensions.hh, dimensions.radius )
          // cone center of mass is at bottom
          cone.centerOfMass = { x: 0, y: 0, z: 0 }
          return cone
        }
        default: {
          throw new Error(
            `Unknown collider type: ${
              colliderType.description || colliderType.toString()
            }`
          )
        }
      }
    })()

    const collider = this.world.createCollider( colliderDesc, rigidBody )
    const bufferGeometry = (() => {
      switch ( colliderType ) {
        case ct.CUBOID: {
          return new BoxGeometry(
            dimensions.hx * 2,
            dimensions.hy * 2,
            dimensions.hz * 2
          )
        }
        case ct.CYLINDER: {
          return new CylinderGeometry(
            dimensions.radius,
            dimensions.radius,
            dimensions.hh * 2,
            32,
            32
          )
        }
        case ct.BALL: {
          return new SphereGeometry( dimensions.radius, 32, 32 )
        }
        case ct.CAPSULE: {
          return new CapsuleGeometry( dimensions.radius, dimensions.height )
        }
        case ct.CONE: {
          return new ConeGeometry(
            dimensions.radius,
            dimensions.hh * 2,
            32,
            32
          )
        }
        default: {
          throw new Error(
            `Unknown collider type: ${
              colliderType.description || colliderType.toString()
            }`
          )
        }
      }
    })()

    const mesh = new Mesh( bufferGeometry, new MeshPhongMaterial( meshOptions ))
    return { rigidBody, mesh, collider }
  }
}
