import { VRM } from '@pixiv/three-vrm'
import { PhysicsAdapter } from '@webaverse-studios/physics-core'
import { nanoid } from 'nanoid'
import { Vector3 } from 'three'
import { PhysicsCharacter } from './PhysicsCharacter'

class PlayerData extends Map {}

/**
 * @class AvatarCharacter Character
 */
export class AvatarCharacter extends PhysicsCharacter {
  /**
   * UUID Of the player.
   *
   * @type {string}
   */
  playerId

  /**
   * Internal storage of player data as a map
   *
   * @type {PlayerData}
   */
  playerData

  /**
   * The avatar of the player.
   *
   * @type {VRM}
   */
  avatar

  /**
   * Create a new base character controller.
   *
   * @param {object} options - The options for the character controller.
   * @param {VRM} options.avatar - The avatar to control.
   * @param {PhysicsAdapter} options.physicsAdapter - The physics adapter to use.
   */
  constructor({ physicsAdapter, avatar }) {
    super({ physicsAdapter })

    this.avatar = avatar
    this.playerId = nanoid()
    this.playerData = new PlayerData()
  }

  /**
   * Update AvatarCharacter
   *
   * @param {Vector3} direction - The direction to move the character.
   * @override
   */
  update( direction ) {
    // Update the physics character controller
    super.update( direction )
  }

  /**
   * Destroy the character controller.
   */
  destroy() {}
}
