/**
 * @file Character controller for the nyx engine.
 * @author Yendor <lecoqjacob@gmail.com>
 */

import { VRM } from '@pixiv/three-vrm'

import { AvatarCharacter as _AvatarCharacter } from '@webaverse-studios/engine-core'
import { PhysicsAdapter } from '@webaverse-studios/physics-core'

/**
 * Character controller for the nyx engine.
 *
 * @class AvatarCharacter
 */
export class AvatarCharacter extends _AvatarCharacter {
  /**
   * Create a new nyx character controller.
   *
   * @param {object} avatarCharacterOptions The options for the character controller.
   * @param {VRM} avatarCharacterOptions.avatar The avatar to control.
   * @param {PhysicsAdapter} avatarCharacterOptions.physicsAdapter The physics adapter to use.
   */
  constructor({ avatar, physicsAdapter }) {
    super({ avatar, physicsAdapter })
  }
}
