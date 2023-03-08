import {
  AmbientLight,
  Camera,
  Light,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Abstract Scene Class
 *
 * @class Scene
 */
export class BaseScene {
  scene: Scene
  canvas: HTMLCanvasElement

  /** Scene Lights */
  lights: Light[] = []

  /** Base GLTF Loader */
  gltfLoader: GLTFLoader

  /** WebGLRenderer */
  renderer: WebGLRenderer

  /**
   * Scene Camera
   *
   * @default PerspectiveCamera
   */
  camera: Camera = new PerspectiveCamera()

  /**
   * Create a BaseScene
   *
   * Scene construction flow:
   *    1. initCamera
   *    2. initRenderer
   *    3. initLights
   *    4. initGeometry
   *    5. initScene
   *
   * @property {HTMLCanvasElement} canvas - scene canvas
   */
  constructor ({ canvas }: { canvas: HTMLCanvasElement }) {
    if (this.constructor === BaseScene) {
      throw new Error("Abstract classes can't be instantiated.")
    }

    // Set up scene
    this.canvas = canvas
    this.scene = new Scene()
    this.gltfLoader = new GLTFLoader()
    this.renderer = new WebGLRenderer({ canvas })
  }

  /**
   * Initialize the scene
   */
  async init () {
    await Promise.all([
      this._initCamera(),
      this._initRenderer(),
      this._initLights(),
      this._initGeometry()
    ])
  }

  /**
   * Configure the scene camera.
   */
  private async _initCamera () {
    this.camera = new PerspectiveCamera()
  }

  /**
   * Configures the scene lights
   *
   * Defaults to a single ambient white light.
   */
  private async _initLights () {
    const light = new AmbientLight(0x404040) // Soft white light
    this.lights.push(light)
    this.scene.add(light)
  }

  /**
   * Configures the scene renderer
   *
   * @param {number} scale - Scale the renderer by this amount.
   */
  // @ts-ignore
  private async _initRenderer (scale: number = 1) {}

  /**
   * Configure the scene geometry
   *
   */
  private async _initGeometry () {}

  /**
   * Update the scene
   */
  update () {}
}
