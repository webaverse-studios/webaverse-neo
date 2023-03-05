import {BaseCharacter} from "./base.js";

/**
 * @class AvatarCharacter
 */
export class AvatarCharacter extends BaseCharacter {
  /**
   * Create a new avatar character controller.
   *
   * @param {Engine} engine
   */
  constructor({engine}) {
    super({engine});

    this.avatar = null
  }
}
