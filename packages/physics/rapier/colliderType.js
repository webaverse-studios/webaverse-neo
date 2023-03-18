import { createEnum } from '@soulofmischief/js-utils'

/**
 * @typedef ColliderType
 * @property {symbol} SPHERE SPHERE shape.
 * @property {symbol} CONE Cone shape.
 * @property {symbol} CUBOID Cuboid shape.
 * @property {symbol} CAPSULE Capsule shape.
 * @property {symbol} TRIMESH Triangle mesh shape
 * @property {symbol} SEGMENT Segment shape.
 * @property {symbol} TRIANGLE Triangle shape.
 * @property {symbol} POLYLINE Polyline shape.
 * @property {symbol} CYLINDER Cylinder shape.
 * @property {symbol} ROUND_CONE Round cone shape.
 * @property {symbol} HEIGHTFIELD Heightfield shape.
 * @property {symbol} CONVEX_HULL Convex hull shape.
 * @property {symbol} CONVEX_MESH Convex mesh shape.
 * @property {symbol} ROUND_CUBOID Rectangular shape with round borders.
 * @property {symbol} ROUND_TRIANGLE Round triangle shape.
 * @property {symbol} ROUND_CYLINDER Round cylinder shape.
 * @property {symbol} ROUND_CONVEX_HULL Round convex hull shape.
 * @property {symbol} ROUND_CONVEX_MESH Round convex mesh shape.
 */

/**
 * Collider types for rigid-bodies
 *
 * @type {ColliderType}
 */
export const colliderType = createEnum(
  'SPHERE',
  'CONE',
  'CUBOID',
  'CAPSULE',
  'TRIMESH',
  'SEGMENT',
  'TRIANGLE',
  'POLYLINE',
  'CYLINDER',
  'ROUND_CONE',
  'HEIGHTFIELD',
  'CONVEX_HULL',
  'CONVEX_MESH',
  'ROUND_CUBOID',
  'ROUND_TRIANGLE',
  'ROUND_CYLINDER',
  'ROUND_CONVEX_HULL',
  'ROUND_CONVEX_MESH'
)
