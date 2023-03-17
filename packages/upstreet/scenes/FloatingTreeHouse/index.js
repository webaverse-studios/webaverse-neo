import { LineSegments } from 'three'
// import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

import { VRM } from '@pixiv/three-vrm'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PhysicsAdapter } from '@webaverse-studios/physics-rapier'
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
 * floatingTreehouse Scene to display a floatingTreehouse and avatar.
 */
export class FloatingTreehouse extends Scene {
  /** @type {GLTF} */
  #floatingTreehouse
  /** @type {GLTF} */
  #islands
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
   * @param {object} floatingTreehouseOptions floatingTreehouse Scene Options
   * @param {HTMLCanvasElement} floatingTreehouseOptions.canvas Canvas to render the scene to
   * @param {PhysicsAdapter} floatingTreehouseOptions.physicsAdapter Physics Adapter to use
   */
  constructor(floatingTreehouseOptions) {
    super(floatingTreehouseOptions)
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
      createRenderer(this._canvas, 1),
    ])

    this.#lines = lines
    this._scene = scene
    this._camera = camera
    this._lights = lights
    const _skygeo = new THREE.BoxGeometry(1000, 1000, 1000)
    const _skyMaterial = new THREE.MeshBasicMaterial({ color: 0x87ceeb })
    _skyMaterial.side = THREE.BackSide
    this._skybox = new THREE.Mesh(_skygeo, _skyMaterial)

    this._renderer = renderer
    this.#controls = createControls(camera, renderer)
  }

  /**
   * Load GLTF Model and return Object3D
   */
  async #initGeometry() {
    const { avatar, floatingTreehouse, islands } = await loadGeometry(
      this._gltfLoader
    )
    this.#avatar = avatar
    this.#floatingTreehouse = floatingTreehouse
    this.#islands = islands
  }

  /**
   * Manipulate the geometry to display the floatingTreehouse and avatar.
   */
  #configureGeometry() {
    // rotate to face the camera
    this.#avatar.scene.position.set(5, -1.5, 1)
    this.#avatar.scene.rotation.set(0, -45, 0)

    const scale = 1
    this.#floatingTreehouse.scene.scale.set(scale, scale, scale)
    this.#floatingTreehouse.scene.position.set(0, 0, 0)
    this.#floatingTreehouse.scene.rotation.set(0, 0, 0)

    this.#islands.scene.scale.set(scale, scale, scale)
    this.#islands.scene.position.set(0, 0, 0)

    this._scene.add(this.#lines)
    this._scene.add(this.#avatar.scene)
    this._scene.add(this.#floatingTreehouse.scene)
    this._scene.add(this.#islands.scene)
    this._scene.add(this._skybox)
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
    this._lights.forEach((light) => this._scene.add(light))
  }

  async init() {
    await Promise.all([this.#configureScene(), this.#initGeometry()])

    this.#addLightsToScene()
    this.#configureGeometry()
    this.#configureCharacter()

    this.#inputManager.destroy()
    this.#inputManager.addEventListeners(document)

    // function down(this: floatingTreehouse, event: KeyboardEvent) {
    //   if (event.key == "ArrowUp") this.movementDirection.x = this.speed;
    //   if (event.key == "ArrowDown") this.movementDirection.x = -this.speed;
    //   if (event.key == "ArrowLeft") this.movementDirection.z = -this.speed;
    //   if (event.key == "ArrowRight") this.movementDirection.z = this.speed;
    //   if (event.key == " ") this.movementDirection.y = this.speed;
    // }

    // function up(this: floatingTreehouse, event: KeyboardEvent) {
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
    this._physicsAdapter.displayDebugInformation(this)
    this._renderer.render(this._scene, this._camera)
  }

  // speed = 0.1;
  // movementDirection = new Vector3(0.0, -0.1, 0.0);

  update() {
    // this.#character.update(this.movementDirection);
    this.#controls.update()
    this.#render()
  }

  get character() {
    this.#character.position.set(...this.#avatar.scene.position.toArray())
    this.#character.rotation.set(...this.#avatar.scene.rotation.toArray())
    return this.#character
  }
}
