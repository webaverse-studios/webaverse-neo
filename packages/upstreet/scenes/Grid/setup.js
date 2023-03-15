import {
  AmbientLight,
  Box3,
  BufferGeometry,
  Color,
  Fog,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import {
  InputManager,
  commands as c,
  defaultBindings as db,
} from '@webaverse-studios/input'
import { PhysicsAdapter, bodyType } from '@webaverse-studios/physics-rapier'
import { colliderType } from '@webaverse-studios/physics-rapier/colliderType'

import { moveController } from './input'

/**
 * Create Scene
 *
 * @returns {Scene} - The configured scene.
 */
export function createScene() {
  const scene = new Scene()

  scene.background = new Color( 0x2a2a2a )
  scene.fog = new Fog( 0xffffff, 0, 750 )

  return scene
}

/**
 * Create WebGL Renderer
 *
 * @param {HTMLCanvasElement} canvas Canvas to render the scene to
 * @param {number} scale Scale the renderer by this amount.
 * @returns {WebGLRenderer} The configured renderer.
 */
export function createRenderer( canvas, scale = 1 ) {
  const renderer = new WebGLRenderer({ canvas })
  renderer.setSize( window.innerWidth, window.innerHeight )
  renderer.setSize( innerWidth * scale, innerHeight * scale, false )
  return renderer
}

/**
 * Create Camera
 *
 * @returns {PerspectiveCamera} The configured camera.
 */
export function createCamera() {
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  camera.position.y = 2
  camera.position.z = 3

  return camera
}

/**
 * Create Lights
 *
 * @returns {PointLight[]} The configured lights.
 */
export function createLights() {
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
 * Create Camera controls for test scene
 *
 * @param {PerspectiveCamera} camera The camera to attach to.
 * @param {WebGLRenderer} renderer The renderer to attach to.
 * @returns {OrbitControls} - The configured controls.
 */
export function createControls( camera, renderer ) {
  const controls = new OrbitControls( camera, renderer.domElement )

  controls.rotateSpeed = 1.0
  controls.zoomSpeed = 1.2
  controls.panSpeed = 0.8

  return controls
}

/**
 * Create debug lines for test scene
 *
 * @returns {LineSegments} - The configured debug lines.
 */
export function createDebugLines() {
  const material = new LineBasicMaterial({
    color: 0xffffff,
    vertexColors: true,
  })
  const geometry = new BufferGeometry()
  return new LineSegments( geometry, material )
}

/**
 * Create input manager for test scene
 *
 * @returns {InputManager} - The configured input manager.
 */
export function createInputManager() {
  const profile = [[c.MOVE_FORWARD, db[c.MOVE_FORWARD], moveController]]
  return new InputManager( profile )
}

/**
 * Generate Terrain
 *
 * @param {PhysicsAdapter} physicsAdapter The physics adapter to use.
 * @param {import('@webaverse-studios/types').GLTF} grid The grid to generate terrain from.
 */
export function createTerrain( physicsAdapter, grid ) {
  // floor
  let floorDimensions = new Box3().setFromObject( grid.scene )
  physicsAdapter.createCollider({
    bodyType: bodyType.FIXED,
    colliderType: colliderType.CUBOID,
    dimensions: {
      hy: floorDimensions.max.y,
      hx: floorDimensions.max.x,
      hz: floorDimensions.max.z,
    },
    rotation: new Vector3( 0, 0, 0 ),
  })

  physicsAdapter.createCollider({
    bodyType: bodyType.DYNAMIC,
    colliderType: colliderType.BALL,
    dimensions: {
      radius: 0.5,
    },
    translation: new Vector3( 6, 4, 0 ),
  })
}
