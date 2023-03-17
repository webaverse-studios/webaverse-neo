import {
  Scene,
  Color,
  Fog,
  WebGLRenderer,
  PerspectiveCamera,
  PointLight,
  AmbientLight,
  DirectionalLight,
  LineBasicMaterial,
  BufferGeometry,
  LineSegments,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/**
 * @returns {Scene} - The configured scene.
 */
export function createScene() {
  const scene = new Scene()

  scene.background = new Color(0x2a2a2a)
  scene.fog = new Fog(0xffffff, 0, 750)

  return scene
}

/**
 * Setup WebGL Renderer
 *
 * @param {HTMLCanvasElement} canvas - Canvas to render the scene to
 * @param {number} scale - Scale the renderer by this amount.
 * @returns {WebGLRenderer} The configured renderer.
 */
export function createRenderer(canvas, scale = 1) {
  const renderer = new WebGLRenderer({ canvas })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setSize(innerWidth * scale, innerHeight * scale, false)
  return renderer
}

/**
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
 * @returns {PointLight[]} The configured lights.
 */
export function createLights() {
  const light1 = new DirectionalLight(0xffc589, 1.5),
    light2 = new DirectionalLight(0xb9beff, 0.75),
    light3 = new AmbientLight(0xffffff, 0.3)

  light1.position.set(5 * Math.random(), 5 * Math.random(), 10)
  light1.castShadow = true

  light2.position.set(5 * Math.random(), 10 * Math.random(), 10)
  light2.castShadow = true

  return [light1, light2, light3]
}

/**
 * Create Camera controls for test scene
 *
 * @param {PerspectiveCamera} camera - The camera to attach to.
 * @param {WebGLRenderer} renderer - The renderer to attach to.
 * @returns {OrbitControls} - The configured controls.
 */
export function createControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement)
  // controls.listenToKeyEvents( window ) // optional

  controls.rotateSpeed = 1.0
  controls.zoomSpeed = 1.2
  controls.panSpeed = 0.8

  // controls.keys = {
  //   LEFT: 'KeyA', //left arrow
  //   UP: 'KeyW', // up arrow
  //   RIGHT: 'KeyD', // right arrow
  //   BOTTOM: 'KeyS', // down arrow
  // }

  return controls
}

/**
 * @returns {LineSegments} - The configured debug lines.
 */
export function createDebugLines() {
  const material = new LineBasicMaterial({
    color: 0xffffff,
    vertexColors: true,
  })
  const geometry = new BufferGeometry()
  return new LineSegments(geometry, material)
}
