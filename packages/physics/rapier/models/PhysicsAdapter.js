import {
  init,
  ColliderDesc,
  RigidBodyDesc,
  Vector3,
  World,
  Collider,
  CoefficientCombineRule,
  RigidBody,
} from '@dimforge/rapier3d-compat'
import {
  LineSegments,
  Vector3 as THREEVector3,
  BufferAttribute,
  Euler,
  Quaternion,
  BoxGeometry,
  SphereGeometry,
  CylinderGeometry,
  CapsuleGeometry,
  MeshPhongMaterial,
  Mesh,
  ConeGeometry,
} from 'three'

import { Debug } from '@webaverse-studios/debug'
import { PhysicsAdapter as _PhysicsAdapter } from '@webaverse-studios/physics-core'

import { bodyType as bt } from '../bodyType'
import { KinematicController } from './KinematicController'
import { colliderType as ct } from '../colliderType'

/**
 * @typedef {import('../bodyType').BodyType} BodyType
 * @typedef {import('../colliderType').ColliderType} ColliderType
 */

/**
 * @typedef {object} Dimensions
 * @property {number} [height] Height
 * @property {number} [radius] Radius
 * @property {number} [hx] Height x dimension
 * @property {number} [hy] Height y dimension
 * @property {number} [hz] Height z dimension
 * @property {number} [halfHeight] Half height
 */

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
  }

  update() {
    // Advance the simulation by one time step.
    this.world.step()
  }

  createKinematicController() {
    return new KinematicController( this.world )
  }

  /**
   * Destroy Character Controller
   *
   * @param {KinematicController} controller Controller to destroy
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
   * Create Heightmap Collider
   *
   * @param {object} params Heightmap parameters
   * @param {number} params.nsubdivs Number of subdivisions
   * @param {number[]} params.heights Heightmap heights
   * @param {THREEVector3} params.scale Scale of the heightmap
   * @returns {Collider} Generated heightmap collider
   */
  createHeightMapCollider({ nsubdivs, heights, scale }) {
    Debug.log( '[PhysicsAdapter: Rapier] - Creating heightmap collider', {
      nsubdivs,
      scale,
      heights,
    })

    let bodyDesc = RigidBodyDesc.fixed()
    let body = this.world.createRigidBody( bodyDesc )
    let collider = ColliderDesc.heightfield(
      nsubdivs,
      nsubdivs,
      new Float32Array( heights ),
      scale
    )

    // Create rigid body for the sphere.
    const rbDesc = RigidBodyDesc.dynamic()
      .setTranslation( 6, 4, 0 )
      .setLinearDamping( 0.1 )
      // .restrictRotations(false, true, false) // Y-axis only
      .setCcdEnabled( true )
    this.sphereBody = this.world.createRigidBody( rbDesc )

    const clDesc = ColliderDesc.ball( 0.5 )
      .setFriction( 0.1 )
      .setFrictionCombineRule( CoefficientCombineRule.Max )
      // .setTranslation(0, 0, 0)
      .setRestitution( 0.6 )
      .setRestitutionCombineRule( CoefficientCombineRule.Max )
    // .setCollisionGroups(CollisionMask.ActorMask | CollisionMask.TouchActor);
    this.world.createCollider( clDesc, this.sphereBody )

    return this.world.createCollider( collider, body )
  }

  /**
   * Create a collider for a rigid-body
   *
   * @param {object} colliderParams Collider parameters
   * @param {BodyType} colliderParams.bodyType Rigid-body type
   * @param {string} colliderParams.colliderType Collider type
   * @param {Vector3} colliderParams.translation Translation
   * @param {Vector3} colliderParams.rotation Rotation
   * @param {Dimensions} colliderParams.dimensions Collider dimensions
   * @returns {{mesh: Mesh, rigidBody: RigidBody, collider: Collider }} Generated collider
   */
  createCollider({
    bodyType,
    colliderType,
    translation,
    rotation,
    dimensions,
  }) {
    const bodyDesc = (() => {
      switch ( Symbol( bodyType ).toString()) {
        case bt.FIXED.toString(): {
          const body = RigidBodyDesc.fixed()
          body.setCanSleep( true )
          return body
        }
        case bt.DYNAMIC.toString(): {
          return RigidBodyDesc.dynamic()
        }
        case bt.KINEMATIC_VELOCITY_BASED.toString(): {
          return RigidBodyDesc.kinematicVelocityBased()
        }
        case bt.KINEMATIC_POSITION_BASED.toString(): {
          return RigidBodyDesc.kinematicPositionBased()
        }
        default: {
          // throw new Error( `Unknown body type: ${bodyType}` )
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
      switch ( Symbol( colliderType ).toString()) {
        case ct.CUBOID.toString(): {
          return ColliderDesc.cuboid(
            dimensions.hx,
            dimensions.hy,
            dimensions.hz
          )
        }
        case ct.CYLINDER.toString(): {
          return ColliderDesc.cylinder(
            dimensions.halfHeight,
            dimensions.radius
          )
        }
        case ct.BALL.toString(): {
          return ColliderDesc.ball( dimensions.radius )
        }
        case ct.CAPSULE.toString(): {
          return ColliderDesc.capsule(
            dimensions.halfHeight,
            dimensions.radius
          )
        }
        case ct.CONE.toString(): {
          const cone = ColliderDesc.cone( dimensions.hh, dimensions.radius )
          // cone center of mass is at bottom
          cone.centerOfMass = { x: 0, y: 0, z: 0 }
          return cone
        }
        default: {
          throw new Error( `Unknown collider type: ${colliderType}` )
        }
      }
    })()

    const collider = this.world.createCollider( colliderDesc, rigidBody.handle )
    const bufferGeometry = (() => {
      switch ( colliderType ) {
        case ct.CUBE: {
          return new BoxGeometry(
            dimensions.hx * 2,
            dimensions.hy * 2,
            dimensions.hz * 2
          )
        }
        case ct.CYLINDER: {
          return CylinderGeometry(
            dimensions.radius,
            dimensions.radius,
            dimensions.hh * 2,
            32,
            32
          )
        }
        case ct.BALL: {
          return SphereGeometry( dimensions.radius, 32, 32 )
        }
        case ct.CAPSULE: {
          return CapsuleGeometry( dimensions.radius, dimensions.height )
        }
        case ct.CONE: {
          return ConeGeometry( dimensions.radius, dimensions.hh * 2, 32, 32 )
        }
        default: {
          throw new Error( `Unknown collider type: ${colliderType}` )
        }
      }
    })()

    const mesh = new Mesh( bufferGeometry, new MeshPhongMaterial())
    return { rigidBody, mesh, collider }
  }
}
