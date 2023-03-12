import { LineSegments } from 'three'
// import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import { VRM } from '@pixiv/three-vrm'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RapierPhysicsAdapter } from '@webaverse-studios/physics-rapier'
import { AvatarCharacter, Scene } from '@webaverse-studios/engine-nyx'

import { InputManager } from '@webaverse-studios/input'

import { loadGeometry } from './geometry'

import {
  createCamera,
  createControls,
  createDebugLines,
  createLights,
  createRenderer,
  createScene,
} from './setup'

/**
 * Grid Scene to display a grid and avatar.
 */
export class Grid extends Scene {
  /** @type {GLTF} */
  #grid
  /** @type {VRM} */
  #avatar
  /** @type {OrbitControls} */
  #controls
  /** @type {AvatarCharacter} */
  #character
  /** @type {LineSegments} */
  #lines

  #inputManager = new InputManager()

  /**
   *
   * @param {object} gridOptions Grid Scene Options
   * @param {HTMLCanvasElement} gridOptions.canvas Canvas to render the scene to
   * @param {RapierPhysicsAdapter} gridOptions.physicsAdapter Physics Adapter to use
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

    this.#lines = lines
    this._scene = scene
    this._camera = camera
    this._lights = lights
    this._renderer = renderer
    this.#controls = createControls( camera, renderer )
  }

  /**
   * Load GLTF Model and return Object3D
   */
  async #initGeometry() {
    const { avatar, grid } = await loadGeometry( this._gltfLoader )
    this.#avatar = avatar
    this.#grid = grid
  }

  /**
   * Manipulate the geometry to display the grid and avatar.
   */
  #configureGeometry() {
    // rotate to face the camera
    this.#avatar.scene.rotation.y = Math.PI

    const scale = 5
    this.#grid.scene.scale.set( scale, scale, scale )
    this.#grid.scene.position.set( 0, 0, 0 )
    this.#grid.scene.rotation.set( 0, 0, 0 )

    this._scene.add( this.#lines )
    this._scene.add( this.#avatar.scene )
    this._scene.add( this.#grid.scene )
  }

  #configureCharacter() {
    this.#character = new AvatarCharacter({
      avatar: this.#avatar,
      physicsAdapter: this._physicsAdapter,
    })
  }

  /**
   * Add lights to the scene
   */
  #addLightsToScene() {
    this._lights.forEach(( light ) => this._scene.add( light ))
  }

  async init() {
    await Promise.all([this.#configureScene(), this.#initGeometry()])

    this.#addLightsToScene()
    this.#configureGeometry()
    this.#configureCharacter()

    this.#inputManager.destroy()
    this.#inputManager.addEventListeners( document )

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
    //   if (event.key == " ") this.movementDirection.y = -this.speed; // Gravity
    // }

    // document.onkeyup = up.bind(this);
    // document.onkeydown = down.bind(this);

    this.update()
  }

  #render() {
    this._physicsAdapter.displayDebugInformation( this )
    this._renderer.render( this._scene, this._camera )
  }

  // speed = 0.1;
  // movementDirection = new Vector3(0.0, -0.1, 0.0);

  update() {
    // this.#character.update(this.movementDirection);
    this.#controls.update()
    this.#render()
  }
}
