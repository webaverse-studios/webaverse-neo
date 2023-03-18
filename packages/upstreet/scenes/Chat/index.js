import { VRM } from '@pixiv/three-vrm'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { AvatarCharacter, Scene } from '@webaverse-studios/engine-nyx'
import { InputManager } from '@webaverse-studios/input'
import { PhysicsAdapter } from '@webaverse-studios/physics-rapier'

import { loadGeometry } from './geometry'
import {
  createCamera,
  createControls,
  createDebugLines,
  createLights,
  createRenderer,
  createScene,
  createTerrain,
} from './setup'

/**
 * Grid Scene to display a grid and avatar.
 */
export class Chat extends Scene {
  /** @type {import('@webaverse-studios/types').GLTF} */
  _grid
  /** @type {VRM} */
  _avatar
  /** @type {OrbitControls} */
  _controls
  /** @type {AvatarCharacter} */
  _character

  #inputManager = new InputManager()

  /**
   * Create a new Chat Scene instance.
   *
   * @param {object} gridOptions Grid Scene Options
   * @param {HTMLCanvasElement} gridOptions.canvas Canvas to render the scene to
   * @param {PhysicsAdapter} gridOptions.physicsAdapter Physics Adapter to use
   */
  constructor( gridOptions ) {
    super( gridOptions )
  }

  /**
   * Configure scene
   */
  async #configureScene() {
    const [scene, camera, lights, lines, renderer] = await Promise.all([
      createScene(),
      createCamera(),
      createLights(),
      createDebugLines(),
      createRenderer( this._canvas, 1 ),
    ])

    this._lines = lines
    this._scene = scene
    this._camera = camera
    this._lights = lights
    this._renderer = renderer
    this._controls = createControls( camera, renderer )
  }

  get scene() {
    return this._scene
  }

  /**
   * Load GLTF Model and return Object3D
   */
  async #initGeometry() {
    const { avatar, grid } = await loadGeometry( this._gltfLoader )
    this._avatar = avatar
    this._grid = grid
  }

  /**
   * Manipulate the geometry to display the grid and avatar.
   */
  #configureGeometry() {
    // rotate to face the camera
    this._avatar.scene.rotation.y = Math.PI

    const scale = 5
    this._grid.scene.scale.set( scale, scale, scale )
    this._grid.scene.position.set( 0, 0, 0 )
    this._grid.scene.rotation.set( 0, 0, 0 )

    this._scene.add( this._lines )
    this._scene.add( this._avatar.scene )
    this._scene.add( this._grid.scene )
  }

  /**
   * Add lights to the scene
   */
  #addLightsToScene() {
    this._lights.forEach(( light ) => this._scene.add( light ))
  }

  #render() {
    this._physicsAdapter.displayDebugInformation( this._lines )
    this._renderer.render( this._scene, this._camera )
  }

  async init() {
    await Promise.all([this.#configureScene(), this.#initGeometry()])
    await Promise.all([
      this.#addLightsToScene(),
      this.#configureGeometry(),
      createTerrain( this._physicsAdapter, this._grid ),
    ])

    this.update()
  }

  update() {
    this._controls.update()
    this.#render()
  }
}
