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
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Configure scene
 *
 * @returns {Scene}
 */
export function createScene(): Scene {
  const scene = new Scene();

  scene.background = new Color(0x2a2a2a);
  scene.fog = new Fog(0xffffff, 0, 750);

  return scene;
}

/**
 * Setup WebGL Renderer
 *
 * @param {HTMLCanvasElement} canvas
 * @param {number} scale
 * @returns {WebGLRenderer}
 */
export function createRenderer(canvas: HTMLCanvasElement, scale = 1) {
  const renderer = new WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(innerWidth * scale, innerHeight * scale, false);
  return renderer;
}

/**
 * Create Scene Camera
 */
export function createCamera() {
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.y = 2;
  camera.position.z = 3;

  return camera;
}

/**
 * Create Grid Scene Lights
 */
export function createLights() {
  const light1 = new PointLight(0xffffff, 1, 0, 2),
    light2 = new PointLight(0xffffff, 1, 0, 2),
    light3 = new AmbientLight(0xffffff, 2);

  light1.position.set(5 * Math.random(), 5 * Math.random(), 10);
  light1.castShadow = true;

  light2.position.set(5 * Math.random(), 10 * Math.random(), 10);
  light2.castShadow = true;

  return [light1, light2, light3];
}

/**
 * Create Camera controls for test scene
 *
 * @param {PerspectiveCamera} camera
 * @param {WebGLRenderer} renderer
 * @returns {OrbitControls}
 */
export function createControls(
  camera: PerspectiveCamera,
  renderer: WebGLRenderer
) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window); // optional

  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;

  controls.keys = {
    LEFT: "KeyA", //left arrow
    UP: "KeyW", // up arrow
    RIGHT: "KeyD", // right arrow
    BOTTOM: "KeyS", // down arrow
  };

  return controls;
}

/**
 * Setup debugging visualizations
 */
export function createDebugLines() {
  const material = new LineBasicMaterial({
    color: 0xffffff,
    vertexColors: true,
  });
  const geometry = new BufferGeometry();
  return new LineSegments(geometry, material);
}
