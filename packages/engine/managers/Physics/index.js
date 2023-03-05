import {Physx} from "./physx.js";
import {PhysicsScene} from "./helpers/index.js";

export * from "./helpers";


/**
 * @class Physics
 */
export class PhysicsManager {
  /**
   * Collection of physics scenes
   * @type {Map<string, PhysicsScene>}
   */
  #scenes = new Map()

  /**
   * Get a physics scene by id
   * @param {string | null} id
   * @returns {PhysicsScene}
   */
  getScene(id = null) {
    let scene = this.#scenes.get(id)
    if (!scene) {
      scene = new PhysicsScene()
      this.#scenes.set(id, scene)
    }
    return scene
  }

  async waitForLoad() {
    await Physx.waitForLoad()
  }
}
