import { nanoid } from 'nanoid'
import { Engine } from '../..'
import { PhysicsCharacter } from './physics'

class PlayerData extends Map {}

/**
 * @class Base Character
 */
export class BaseCharacter extends PhysicsCharacter {
  /** @property {Engine} */
  engine: Engine

  /**
   * UUID Of the player.
   *
   * @property {string}
   */
  playerId: string

  /**
   * Internal storage of player data as a map
   *
   * @property {PlayerData}
   */
  playerData: PlayerData

  /**
   * The avatar of the player.
   */
  avatar: any

  /**
   * Create a new base character controller.
   *
   * @param {Engine} engine
   */
  constructor ({ engine }: { engine: Engine }) {
    super()

    this.avatar = null
    this.engine = engine
    this.playerId = nanoid()
    this.playerData = new PlayerData()
  }

  /**
   * Destroy the character controller.
   */
  destroy () {}
}
