/**
 * @file Character controller for the nyx engine.
 * @author Yendor <lecoqjacob@gmail.com>
 */

import { VRM } from "@pixiv/three-vrm";

import { AvatarCharacter as _AvatarCharacter } from "@webaverse-studios/engine-core";
import { PhysicsAdapter } from "@webaverse-studios/physics-core";

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
  constructor({
    avatar,
    physicsAdapter,
  }: {
    avatar: VRM;
    physicsAdapter: PhysicsAdapter;
  }) {
    super({ avatar, physicsAdapter });
  }
}
