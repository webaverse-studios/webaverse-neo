import {
  AmbientLight,
  Camera,
  Color,
  Fog,
  Light,
  LineSegments,
  PerspectiveCamera,
  Scene as THREEScene,
  WebGLRenderer,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { PhysicsAdapter } from '@webaverse-studios/physics-core'

/**
 * Abstract Scene Class
 */
export class Scene {
  /**
   * Class Name
   *
   * @type {string}
   */
  _name

  /**
   * Base Three.js Scene
   *
   * @type {THREEScene}
   * @see {@link https://threejs.org/docs/#api/en/scenes/Scene}
   */
  _scene

  /**
   * Canvas to paint to
   *
   * @type {HTMLCanvasElement}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement}
   */
  _canvas

  /**
   * WebGLRenderer
   *
   * @type {WebGLRenderer}
   * @see {@link https://threejs.org/docs/#api/en/renderers/WebGLRenderer}
   */
  _renderer

  /**
   * Scene Camera
   *
   * @type {Camera}
   * @default PerspectiveCamera
   * @see {@link https://threejs.org/docs/#api/en/cameras/PerspectiveCamera}
   */
  _camera

  /**
   * Physics Adapter
   *
   * @type {PhysicsAdapter}
   * @see {@link PhysicsAdapter}
   */
  _physicsAdapter

  /**
   * Scene Lights
   *
   * @type {Light[]}
   * @see {@link https://threejs.org/docs/#api/en/lights/Light}
   */
  _lights

  /**
   * Base GLTF Loader
   *
   * @type {GLTFLoader}
   * @see {@link https://threejs.org/docs/#examples/en/loaders/GLTFLoader}
   */
  _gltfLoader

  /**
   * Debugging lines
   *
   * @type {LineSegments}
   * @see {@link https://threejs.org/docs/#api/en/objects/LineSegments}
   */
  _debugLines

  /**
   * Create a Scene
   *
   * @param {object} options The options for the scene.
   * @param {HTMLCanvasElement} options.canvas scene canvas
   * @param {PhysicsAdapter} options.physicsAdapter physics adapter
   *
   * ⚠️ **NOTE**: {@link Engine} will call {@link init} after instantiation. ⚠️
   */
  constructor({ canvas, physicsAdapter }) {
    if ( this.constructor === Scene ) {
      throw new Error( "Abstract classes can't be instantiated." )
    }

    this._name = this.constructor.name
    this._physicsAdapter = physicsAdapter
    this.#configureScene( canvas )
  }

  get name() {
    return this._name
  }

  get debugLines() {
    return this._debugLines
  }

  /**
   * Configure Scene
   *
   * @param {HTMLCanvasElement} canvas scene canvas
   */
  #configureScene = ( canvas ) => {
    this._canvas = canvas
    this._scene = createTHREEScene()
    this._camera = createCamera()
    this._gltfLoader = new GLTFLoader()
    this._debugLines = new LineSegments()
    this._renderer = createRenderer( canvas, 1 )
  }

  /**
   * Add lights to the scene
   */
  #addLightsToScene = () => {
    this._lights.forEach(( light ) => this._scene.add( light ))
  }

  /**
   * Initialize the scene
   */
  async init() {
    this._lights = createLights()
    this.#addLightsToScene()
    this.update()
  }

  /**
   * Update the scene
   */
  update() {}
}

/**
 * Creates the THREE.js scene
 *
 * @returns {THREEScene} The configured scene.
 */
const createTHREEScene = () => {
  const scene = new THREEScene()

  // Configure scene.
  scene.background = new Color( 0x2a2a2a )
  scene.fog = new Fog( 0xffffff, 0, 750 )

  return scene
}

/**
 * Creates the scene camera.
 *
 * @returns {PerspectiveCamera} The configured camera.
 */
const createCamera = () => {
  return new PerspectiveCamera()
}

/**
 * Creates the scene lights
 *
 * @returns {Light[]} The configured renderer.
 */
const createLights = () => {
  return [new AmbientLight( 0xffffff, 2 )]
}

/**
 * Creates the scene renderer
 *
 * @param {HTMLCanvasElement} canvas The canvas to render to.
 * @param {number} scale Scale the renderer by this amount.
 * @returns {WebGLRenderer} The configured renderer.
 */
const createRenderer = ( canvas, scale = 1 ) => {
  const renderer = new WebGLRenderer({ canvas })
  renderer.setSize( window.innerWidth, window.innerHeight )
  renderer.setSize( innerWidth * scale, innerHeight * scale, false )
  return renderer
}
