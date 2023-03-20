import { VRM } from '@pixiv/three-vrm'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import {
  AvatarCharacter,
  RenderingScene,
} from '@webaverse-studios/engine-nyx'
import { InputManager } from '@webaverse-studios/input'
import { PhysicsAdapter } from '@webaverse-studios/physics-rapier'

import { loadGeometry } from './geometry'
import {
  createCamera,
  createControls,
  createDebugLines,
  createInputManager,
  createLights,
  createRenderer,
  createTerrain,
} from './setup'

/**
 * Grid Scene to display a grid and avatar.
 */
export class Chat extends RenderingScene {
  /** @type {import('@webaverse-studios/types').GLTF} */
  _grid
  /** @type {VRM} */
  _avatar
  /** @type {OrbitControls} */
  _controls
  /** @type {AvatarCharacter} */
  _character

  /** @type {PhysicsAdapter} */
  _physicsAdapter

  _terrain

  #inputManager = new InputManager()

  physicsObjects = []

  /**
   * Create a new Chat Scene instance.
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

    const [camera, lights, lines, inputManager, renderer] = await Promise.all(
      [
        createCamera(),
        createLights(),
        createDebugLines(),
        createInputManager( ctx ),
        createRenderer( this._canvas, 1 ),
      ]
    )

    this._camera = camera
    this._lights = lights
    this._debugLines = lines
    this._renderer = renderer
    this._inputManager = inputManager
    this._controls = createControls( camera, renderer )
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

    this.add( this._debugLines )
    this.add( this._avatar.scene )
    this.add( this._grid.scene )
  }

  #configureInputManager() {
    this._inputManager.destroy()
    this._inputManager.addEventListeners( document )
  }

  /**
   * Add lights to the scene
   */
  #addLightsToScene() {
    this._lights.forEach(( light ) => this.add( light ))
  }

  #updatePhysicsObjects() {
    this.physicsObjects.forEach(( object ) => {
      object.mesh.position.copy( object.rigidBody.translation())
      object.mesh.quaternion.copy( object.rigidBody.rotation())
    })
  }

  #render() {
    this._physicsAdapter.displayDebugInformation( this._debugLines )
    this._renderer.render( this, this._camera )
  }

  async init() {
    await Promise.all([this.#configureScene(), this.#initGeometry()])
    const [_a, _b, _c, terrain] = await Promise.all([
      this.#addLightsToScene(),
      this.#configureGeometry(),
      this.#configureInputManager(),
      createTerrain( this._physicsAdapter, this._grid ),
    ])

    this._terrain = terrain
    console.log( this._grid )
    this.addPhysicsObject({ ...terrain, mesh: this._grid.scene })

    this.update()
  }

  /**
   * Add a physics object to the scene.
   *
   * @param {object} object Physics Object
   * @param {import('@webaverse-studios/physics-rapier').Collider} object.collider Collider to add to the physics world
   * @param {import('@webaverse-studios/physics-rapier').RigidBody} object.rigidBody RigidBody to add to the physics world
   * @param {import('three').Mesh} object.mesh Mesh to add to the scene
   */
  addPhysicsObject( object ) {
    this.physicsObjects.push( object )
  }

  update() {
    this._controls.update()
    this.#updatePhysicsObjects()
    this.#render()
  }
}
