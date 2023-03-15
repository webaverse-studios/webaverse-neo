import { createEnum } from '@soulofmischief/js-utils'

/**
 * @typedef ColliderType
 * @property {string} BALL Ball shape.
 * @property {string} CONE Cone shape.
 * @property {string} CUBOID Cuboid shape.
 * @property {string} CAPSULE Capsule shape.
 * @property {string} TRIMESH Triangle mesh shape
 * @property {string} SEGMENT Segment shape.
 * @property {string} TRIANGLE Triangle shape.
 * @property {string} POLYLINE Polyline shape.
 * @property {string} CYLINDER Cylinder shape.
 * @property {string} ROUND_CONE Round cone shape.
 * @property {string} HEIGHTFIELD Heightfield shape.
 * @property {string} CONVEX_HULL Convex hull shape.
 * @property {string} CONVEX_MESH Convex mesh shape.
 * @property {string} ROUND_CUBOID Rectangular shape with round borders.
 * @property {string} ROUND_TRIANGLE Round triangle shape.
 * @property {string} ROUND_CYLINDER Round cylinder shape.
 * @property {string} ROUND_CONVEX_HULL Round convex hull shape.
 * @property {string} ROUND_CONVEX_MESH Round convex mesh shape.
 */

/**
 * Collider types for rigid-bodies
 *
 * @type {ColliderType}
 */
export const colliderType = createEnum(
  'BALL',
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
