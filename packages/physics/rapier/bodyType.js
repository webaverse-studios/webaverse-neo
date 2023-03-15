import { createEnum } from '@soulofmischief/js-utils'

/**
 * @typedef BodyType
 * @property {symbol} FIXED Fixed rigid-body.
 * @property {symbol} DYNAMIC Dynamic rigid-body.
 * @property {symbol} KINEMATIC_VELOCITY_BASED Kinematic rigid-body with
 * velocity-based motion.
 * @property {symbol} KINEMATIC_POSITION_BASED Kinematic rigid-body with
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
