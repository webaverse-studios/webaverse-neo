import {
  BoxGeometry,
  CapsuleGeometry,
  ConeGeometry,
  CylinderGeometry,
  Mesh,
  MeshPhongMaterial,
  SphereGeometry,
  Scene as THREEScene,
  Vector3,
} from 'three'

import {
  PhysicsAdapter,
  bodyType as bt,
  colliderType as ct,
} from '@webaverse-studios/physics-rapier'

/**
 * @typedef {object} MeshOptions
 * @property {string} [color] Color of the mesh
 */

/**
 * Generate a Shape
 *
 * @param {object} params Parameters
 * @param {THREEScene} params.scene Three.js Scene
 * @param {PhysicsAdapter} params.physicsAdapter Physics Adapter
 * @param {import('@webaverse-studios/physics-rapier/models/PhysicsAdapter').DimensionOptions} params.dimensions Dimensions
 * @param {MeshOptions} params.meshOptions Mesh Options
 * @param {Vector3} params.translation Translation of the shape
 * @param {Vector3} params.rotation Rotation of the shape
 * @param {import('@webaverse-studios/physics-rapier').BodyType} params.bodyType Body Type
 * @param {import('@webaverse-studios/physics-rapier/colliderType').ColliderType} params.colliderType Collider Type
 */
export function generateShapeAt({
  scene,
  physicsAdapter,
  dimensions,
  bodyType = bt.DYNAMIC,
  colliderType = ct.CUBOID,
  rotation = new Vector3(),
  translation = new Vector3(),
  meshOptions = { color: '#D3D3D3' },
}) {
  physicsAdapter.createCollider({
    bodyType,
    colliderType,
    dimensions,
    translation,
    rotation,
  })

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
          dimensions.height,
          32,
          32
        )
      }
      case ct.SPHERE: {
        return new SphereGeometry( dimensions.radius, 32, 32 )
      }
      case ct.CAPSULE: {
        return new CapsuleGeometry( dimensions.radius, dimensions.height )
      }
      case ct.CONE: {
        return new ConeGeometry( dimensions.radius, dimensions.height, 32, 32 )
      }
    }
  })()

  scene.add( new Mesh( bufferGeometry, new MeshPhongMaterial( meshOptions )))
}
