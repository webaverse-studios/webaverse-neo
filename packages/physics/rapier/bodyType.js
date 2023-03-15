import { createEnum } from '@soulofmischief/js-utils'

/**
 * @typedef BodyType
 * @property {string} FIXED Fixed rigid-body.
 * @property {string} DYNAMIC Dynamic rigid-body.
 * @property {string} KINEMATIC_VELOCITY_BASED Kinematic rigid-body with
 * velocity-based motion.
 * @property {string} KINEMATIC_POSITION_BASED Kinematic rigid-body with
 * position-based motion.
 */

/**
 * Body types for rigid-bodies
 *
 * @type {BodyType}
 */
export const bodyType = createEnum(
  'FIXED',
  'DYNAMIC',
  'KINEMATIC_VELOCITY_BASED',
  'KINEMATIC_POSITION_BASED'
)
