import * as a from '../actions/index'
import { defaultBindings as b } from '../bindings/index'
import { commands as c } from '../commands'

/**
 * The default profile.
 *
 * @type {Profile}
 */
export const defaultProfile = [
  [c.ATTACK, b[c.ATTACK], a.attack],
  [c.JUMP, b[c.JUMP], a.jump],
  [c.MOVE_FORWARD, b[c.MOVE_FORWARD], a.moveForward],
  [c.MOVE_BACKWARD, b[c.MOVE_BACKWARD], a.moveBackward],
  [c.MOVE_LEFT, b[c.MOVE_LEFT], a.moveLeft],
  [c.MOVE_RIGHT, b[c.MOVE_RIGHT], a.moveRight],
]
