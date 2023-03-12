/**
 * @file Character controller for the nyx engine.
 * @author Yendor <lecoqjacob@gmail.com>
 */

import { AvatarCharacter as _AvatarCharacter, Engine } from "@webaverse-studios/engine-core";

/**
 * Character controller for the nyx engine.
 *
 * @class AvatarCharacter
 */
export class AvatarCharacter extends _AvatarCharacter {
  /**
   * Create a new nyx character controller.
   *
   * @property {Engine} engine
   */
  constructor({ engine, physicsAdapter }) {
    super({ engine, physicsAdapter });
  }
}
