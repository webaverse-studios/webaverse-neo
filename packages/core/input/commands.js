import { createEnum } from '@soulofmischief/js-utils'

/**
 * @typedef Commands
 * @property {string} ATTACK Attack command
 * @property {string} JUMP Jump command
 * @property {string} MOVE_FORWARD Move forward command
 * @property {string} MOVE_BACKWARD Move backward command
 * @property {string} MOVE_LEFT Move left command
 * @property {string} MOVE_RIGHT Move right commands
 */

/**
 * Command enum
 *
 * @type {Commands}
 */
export const commands = createEnum(
  'ATTACK',
  'JUMP',
  'MOVE_FORWARD',
  'MOVE_BACKWARD',
  'MOVE_LEFT',
  'MOVE_RIGHT'
)
