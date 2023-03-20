import {
  Collider,
  ColliderDesc,
  RigidBody,
  RigidBodyDesc,
  Vector3,
  World,
} from '@dimforge/rapier3d-compat'
import {BufferAttribute, Euler, LineSegments, Quaternion} from 'three'

import {
  PhysicsAdapter as _PhysicsAdapter
} from '@webaverse-studios/physics-core'

import {KinematicController} from './KinematicController'
import {bodyType as bt} from '../bodyType'
import {colliderType as ct} from '../colliderType'
import {getRapier} from '../lib'

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
 * @property {Float32Array} [points] Points for convex hull
 * @property {Float32Array} [vertices] vertices for triangle mesh
 * @property {Uint32Array} [indices] indices for triangle mesh
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
   * @property {import('@dimforge/rapier3d-compat').Collider} collider Generated Collider
   * @property {import('@dimforge/rapier3d-compat').RigidBody} rigidBody Generated Rigid-body
   * Generated Rigid-body
   */

  /**
   * Create a collider for a rigid-body
   *
   * @param {object} params Collider parameters
   * @param {symbol} params.bodyType Rigid-body type
   * @param {symbol} params.colliderType Collider type
   * @param {Vector3} params.translation Translation
   * @param {Vector3} params.rotation Rotation
   * @param {DimensionOptions} params.dimensions Collider dimensions
   * Mesh options
   * @returns {{collider: Collider, rigidBody: RigidBody}} Generated
   * collider and rigid-body
   */
  createCollider({
    bodyType,
    colliderType,
    translation,
    rotation,
    dimensions,
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
        case ct.SPHERE: {
          return ColliderDesc.ball( dimensions.radius )
        }
        case ct.CAPSULE: {
          return ColliderDesc.capsule(
            dimensions.halfHeight,
            dimensions.radius
          )
        }
        case ct.CONE: {
          const cone = ColliderDesc.cone(
            dimensions.halfHeight,
            dimensions.radius
          )
          // cone center of mass is at bottom
          cone.centerOfMass = { x: 0, y: 0, z: 0 }
          return cone
        }
        case ct.CONVEX_HULL: {
          return ColliderDesc.convexHull( dimensions.points )
        }
        case ct.TRIMESH: {
          return ColliderDesc.trimesh( dimensions.vertices, dimensions.indices )
        }
        default: {
          throw new Error(
            `Collider type: ${
              colliderType.description || colliderType.toString()
            } is not found or not supported.`
          )
        }
      }
    })()

    const collider = this.world.createCollider( colliderDesc, rigidBody )
    return { rigidBody, collider }
  }
}
