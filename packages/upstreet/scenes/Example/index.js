import {
  AmbientLight,
  Color,
  Fog,
  Object3D,
  PerspectiveCamera,
  PointLight,
  Scene as THREEScene,
  WebGLRenderer,
} from 'three'
import { PhysicsAdapter } from '@webaverse-studios/physics-rapier'
import { Scene } from '@webaverse-studios/engine-nyx'
import { loadGeometry } from './geometry'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class Example extends Scene {
  /** @type {Object3D} */
  #cube

  /**
   *
   * @param {HTMLCanvasElement} canvas - Canvas to render the scene to
   * @param {PhysicsAdapter} physicsAdapter - Physics Adapter to use
   */
  constructor({ canvas, physicsAdapter }) {
    super({ canvas, physicsAdapter })
  }

  /**
   * Configure Scene
   */
  #configureScene() {
    this._scene = createTHREEScene()
    this._camera = createCamera()
    this._lights = createLights()
    this._renderer = createRenderer( this._canvas, 1 )
  }

  /**
   * Load GLTF Model and return Object3D
   */
  async #initCube() {
    this.#cube = await createCube( this._gltfLoader )
    this._scene.add( this.#cube )
  }

  /**
   * Add lights to the scene
   */
  #addLightsToScene() {
    this._lights.forEach(( light ) => this._scene.add( light ))
  }

  /**
   * Initialize everything in the scene
   */
  async init() {
    this.#configureScene()
    this.#addLightsToScene()

    await Promise.all([await this.#initCube()])

    this.update()
  }

  update() {
    this.#cube.rotation.x += 0.004
    this.#cube.rotation.y += 0.004
    this._renderer.render( this._scene, this._camera )
  }
}

/**
 * @returns {PerspectiveCamera} - The configured camera.
 */
function createCamera() {
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = 10
  return camera
}

/**
 * @returns {PointLight[]} - The configured lights.
 */
function createLights() {
  const light1 = new PointLight( 0xffffff, 1, 0, 2 ),
    light2 = new PointLight( 0xffffff, 1, 0, 2 ),
    light3 = new AmbientLight( 0xffffff, 2 )

  light1.position.set( 5 * Math.random(), 5 * Math.random(), 10 )
  light1.castShadow = true

  light2.position.set( 5 * Math.random(), 10 * Math.random(), 10 )
  light2.castShadow = true

  return [light1, light2, light3]
}

/**
 * Setup WebGL Renderer
 *
 * @param {HTMLCanvasElement} canvas - Canvas to render the scene to
 * @param {number} scale - Scale the renderer by this amount.
 * @returns {WebGLRenderer} - The configured renderer.
 */
function createRenderer( canvas, scale = 1 ) {
  const renderer = new WebGLRenderer({ canvas })
  renderer.setSize( window.innerWidth, window.innerHeight )
  renderer.setSize( innerWidth * scale, innerHeight * scale, false )
  return renderer
}

/**
 * @returns {Scene} - The configured scene.
 */
function createTHREEScene() {
  const scene = new THREEScene()

  // Configure scene.
  scene.background = new Color( 0x2a2a2a )
  scene.fog = new Fog( 0xffffff, 0, 750 )

  return scene
}

/**
 *
 * @param {GLTFLoader} loader - The GLTFLoader to use.
 * @returns {Promise<Object3D>} - The loaded cube.
 */
async function createCube( loader ) {
  const cube = await loadGeometry( loader )
  return cube.scene.getObjectByName( 'Cube' )
}
