import {Object3D, Vector3} from "three";
import {nanoid} from 'nanoid'
import {CharacterPhysics} from "./physics";

class PlayerData extends Map {
}

/**
 * @class Base Character
 */
export class BaseCharacter extends Object3D {
  /**
   * Create a new character controller.
   *
   * @param {Engine} engine
   */
  constructor({engine, physicsTracker}) {
    super();

    this.engine = engine
    this.velocity = new Vector3()

    this.playerId = nanoid()
    this.playerData = new PlayerData()
    this.characterPhysics = new CharacterPhysics(this)

    this.characterPhysics.loadCharacterController(
      20
      , 20
    )
  }

  /**
   * Get the current position of the character.
   * @param positionArray - Array to store the position in.
   * @returns {number[]}
   */
  getPosition(positionArray) {
    return this.position.toArray(positionArray)
  }

  /**
   * Get the current rotation of the character.
   * @param quaternionArray - Array to store the rotation in.
   * @returns {number[]}
   */
  getQuaternion(quaternionArray) {
    return this.quaternion.toArray(quaternionArray)
  }

  /**
   * Get the current velocity of the character.
   * @param velocityArray - Array to store the velocity in.
   * @returns {number[]}
   */
  getVelocity(velocityArray) {
    return this.velocity.toArray(velocityArray)
  }

  /**
   * Destroy the character controller.
   */
  destroy() {
  }
}
