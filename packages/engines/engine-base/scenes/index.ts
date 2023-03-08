import {
  AmbientLight,
  Camera,
  Color,
  Fog,
  Light,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { Engine } from "../index";

/**
 * Abstract Scene Class
 *
 * @class Scene
 */
export class BaseScene {
  /** Class Name */
  #name: string;

  /** Base Three.js Scene */
  declare scene: Scene;

  /** Canvas to paint to */
  declare canvas: HTMLCanvasElement;

  /** Scene Lights */
  lights: Light[] = [];

  /** Base GLTF Loader */
  declare gltfLoader: GLTFLoader;

  /** WebGLRenderer */
  declare renderer: WebGLRenderer;

  /**
   * Scene Camera
   *
   * @default PerspectiveCamera
   * @see {@link https://threejs.org/docs/#api/en/cameras/PerspectiveCamera}
   */
  camera: Camera | undefined;

  /**
   * Create a BaseScene
   *
   * @property {HTMLCanvasElement} canvas - scene canvas\
   *
   * ⚠️ **NOTE**: {@link Engine} will call {@link init} after instantiation.
   */
  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    if (this.constructor === BaseScene) {
      throw new Error("Abstract classes can't be instantiated.");
    }

    this.#name = this.constructor.name;
    this.#configureScene(canvas);
    this.#addLightsToScene();
  }

  get name() {
    return this.#name;
  }

  /**
   * Configure NyxScene
   */
  #configureScene = (canvas: HTMLCanvasElement) => {
    this.canvas = canvas;
    this.scene = createScene();
    this.camera = createCamera();
    this.lights = createLights();
    this.gltfLoader = new GLTFLoader();
    this.renderer = createRenderer(canvas, 1);
  };

  /**
   * Add lights to the scene
   */
  #addLightsToScene = () => {
    this.lights.forEach((light) => this.scene.add(light));
  };

  /**
   * Initialize the scene
   */
  async init(): Promise<void> {
    this.update();
  }

  /**
   * Update the scene
   */
  update() {}
}

/**
 * Configure the scene camera.
 */
const createCamera = () => {
  return new PerspectiveCamera();
};

/**
 * Configures the scene lights
 */
const createLights = () => {
  return [new AmbientLight(0xffffff, 2)];
};

/**
 * Configures the scene renderer
 *
 * @param {number} scale - Scale the renderer by this amount.
 */
const createRenderer = (canvas: HTMLCanvasElement, scale = 1) => {
  const renderer = new WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(innerWidth * scale, innerHeight * scale, false);
  return renderer;
};

const createScene = () => {
  const scene = new Scene();

  // Configure scene.
  scene.background = new Color(0x2a2a2a);
  scene.fog = new Fog(0xffffff, 0, 750);

  return scene;
};
