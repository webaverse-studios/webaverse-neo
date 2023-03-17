import { VRM } from '@pixiv/three-vrm'
import { nanoid } from 'nanoid'
import { Box3, Vector3 } from 'three'

import { Debug } from '@webaverse-studios/debug'
import { PhysicsAdapter } from '@webaverse-studios/physics-core'

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

  #pos = new Vector3()

  /**
   * Create a new base character controller.
   *
   * @param {object} options The options for the character controller.
   * @param {VRM} options.avatar The avatar to control.
   * @param {PhysicsAdapter} options.physicsAdapter The physics adapter to use.
   */
  constructor({ physicsAdapter, avatar }) {
    super({ physicsAdapter })

    this.avatar = avatar
    this.playerId = nanoid()
    this.playerData = new PlayerData()

    console.log( new Box3().expandByObject( avatar.scene ))

    document.addEventListener( 'keydown', this.#updatePos.bind( this ))
  }

  #updatePos( event ) {
    const code = event.code

    if ( code === 'KeyX' ) {
      this.#pos.y += 0.1
      Debug.log( this.#pos, this.position )
    }
    if ( code === 'KeyZ' ) {
      this.#pos.y -= 0.1
      Debug.log( this.#pos, this.position )
    }
  }

  #syncAvatarWithPhysics() {
    this.avatar.scene.position.copy( this.position )
    this.avatar.scene.rotation.copy( this.rotation )
  }

  /**
   * Destroy the character controller.
   */
  destroy() {}

  /**
   * Update AvatarCharacter
   *
   * @override
   */
  update() {
    // Update the physics character controller
    super.update()
    this.#syncAvatarWithPhysics()
  }
}
