import { VRM } from '@pixiv/three-vrm'
import { TextureLoader } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { Debug } from '@webaverse-studios/debug'
import { AvatarCharacter, Scene } from '@webaverse-studios/engine-nyx'
import { PhysicsAdapter } from '@webaverse-studios/physics-rapier'

import { loadGeometry } from './load'
import {
  createCamera,
  createControls,
  createDebugLines,
  createInputManager,
  createLights,
  createRenderer,
  createScene,
  createTerrain,
} from './setup'

/** @typedef {import('@webaverse-studios/types').GLTF} GLTF */

/**
 * Grid Scene to display a grid and avatar.
 *
 * @class
 * @augments Scene
 */
export class Grid extends Scene {
  /** @type {GLTF} */
  _grid
  /** @type {VRM} */
  _avatar
  /** @type {OrbitControls} */
  _controls
  /** @type {AvatarCharacter} */
  _character
  /** @type {PhysicsAdapter} */
  _physicsAdapter

  /**
   * Grid Scene Constructor
   *
   * @param {object} gridOptions Grid Scene Options
   * @param {HTMLCanvasElement} gridOptions.canvas Canvas to render the scene to
   * @param {PhysicsAdapter} gridOptions.physicsAdapter Physics Adapter to use
   */
  constructor( gridOptions ) {
    super( gridOptions )
    this._physicsAdapter = gridOptions.physicsAdapter
  }

  /**
   * Configure scene
   */
  async #configureScene() {
    const ctx = this

    const [scene, camera, lights, lines, inputManager, renderer] =
      await Promise.all([
        createScene(),
        createCamera(),
        createLights(),
        createDebugLines(),
        createInputManager( ctx ),
        createRenderer( this._canvas, 1 ),
      ])

    ctx._lines = lines
    ctx._scene = scene
    ctx._camera = camera
    ctx._lights = lights
    ctx._renderer = renderer
    ctx._inputManager = inputManager
    ctx._textureLoader = new TextureLoader()
    ctx._controls = createControls( camera, renderer )
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

  #configureInputManager() {
    this._inputManager.destroy()
    this._inputManager.addEventListeners( document )
  }

  #configureCharacter() {
    Debug.log( 'Configuring Character', this )
    this._character = new AvatarCharacter({
      avatar: this._avatar,
      physicsAdapter: this._physicsAdapter,
    })
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
      this.#configureCharacter(),
      this.#configureInputManager(),
      createTerrain( this._physicsAdapter, this._grid ),
    ])

    // function down(this: Grid, event: KeyboardEvent) {
    //   if (event.key == "ArrowUp") this.movementDirection.x = this.speed;
    //   if (event.key == "ArrowDown") this.movementDirection.x = -this.speed;
    //   if (event.key == "ArrowLeft") this.movementDirection.z = -this.speed;
    //   if (event.key == "ArrowRight") this.movementDirection.z = this.speed;
    //   if (event.key == " ") this.movementDirection.y = this.speed;
    // }

    // function up(this: Grid, event: KeyboardEvent) {
    //   if (event.key == "ArrowUp") this.movementDirection.x = 0.0;
    //   if (event.key == "ArrowDown") this.movementDirection.x = 0.0;
    //   if (event.key == "ArrowLeft") this.movementDirection.z = 0.0;
    //   if (event.key == "ArrowRight") this.movementDirection.z = 0.0;
    // Gravity
    //   if (event.key == " ") this.movementDirection.y = -this.speed;
    // }

    // document.onkeyup = up.bind(this);
    // document.onkeydown = down.bind(this);

    this.update()
  }

  update() {
    this._character.update()
    this._controls.update()
    this.#render()
  }
}
