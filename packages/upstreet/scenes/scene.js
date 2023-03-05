import {Camera, Scene, WebGLRenderer} from 'three'

/**
 * Abstract Scene Class
 *
 * @class Scene
 * @abstract
 */
export class NyxScene {
  /**
   * Create a NyxScene
   * @param {HTMLCanvasElement} canvas scene canvas
   * @param {Camera} camera Scene Camera
   * @param {Light[]} [lights] - scene lights
   */
  constructor({canvas, camera, lights}) {
    if (this.constructor === NyxScene) {
      throw new Error("Abstract classes can't be instantiated.")
    }

    // Set up camera.
    this.camera = camera
    // Set up canvas.
    this.canvas = canvas
    // Set up renderer.
    this.renderer = new WebGLRenderer({canvas})
    // Set up scene.
    this.scene = new Scene()

    const {renderer, scene} = this

    // Configure.
    this.configureCamera()
    this.configureScene(scene)
    this.configureLights(lights)
    this.configureRenderer(1)
  }

  /**
   * Configure the scene camera.
   */
  configureCamera() {
    throw "NyxScene method configureCamera not implemented";
  }

  /**
   * Configures the scene lights
   *
   * @param {Light[]} lights - A positive or negative number.
   */
  configureLights(lights) {
    throw "NyxScene method configureLights not implemented";
  }

  /**
   * Configures the scene renderer
   * @param {number} scale - Scale the renderer by this amount.
   */
  configureRenderer(scale = 1) {
    throw "NyxScene method configureRenderer not implemented";
  }


  /**
   * Configure the scene
   */
  configureScene() {
    throw "NyxScene method configureScene not implemented";
  }
}
