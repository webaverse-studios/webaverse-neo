import { createEnum } from '@soulofmischief/js-utils'


/**
 * Command enum,
 */
export const commands = createEnum(
  'ATTACK',
  'JUMP',
  'MOVE_FORWARD',
  'MOVE_BACKWARD',
  'MOVE_LEFT',
  'MOVE_RIGHT',
)
