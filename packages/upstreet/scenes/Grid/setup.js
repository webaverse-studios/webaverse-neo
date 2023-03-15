import { InputManager } from '@webaverse-studios/input'
import {
  Scene,
  Color,
  Fog,
  WebGLRenderer,
  PerspectiveCamera,
  PointLight,
  AmbientLight,
  LineBasicMaterial,
  BufferGeometry,
  LineSegments,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { commands as c, defaultBindings as db } from '@webaverse-studios/input'

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
