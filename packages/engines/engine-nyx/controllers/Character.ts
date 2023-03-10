/**
 * @file Character controller for the nyx engine.
 * @author Yendor <lecoqjacob@gmail.com>
 */

import { Engine } from "@webaverse-studios/engine-core";
import { AvatarCharacter } from "@webaverse-studios/engine-core/controllers/Character/index.js";

/**
 * Character controller for the nyx engine.
 *
 * @class Nyx Character
 */
export class NyxCharacter extends AvatarCharacter {
  /**
   * Create a new nyx character controller.
   *
   * @property {Engine} engine
   */
  constructor({ engine }) {
    super({ engine });
  }
}
