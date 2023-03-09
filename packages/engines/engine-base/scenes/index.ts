import {
  AmbientLight,
  Camera,
  Color,
  Fog,
  Light,
  LineSegments,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { Engine } from "../index";
import { PhysicsAdapter } from "@webaverse-studios/physics-base";

/**
 * Abstract Scene Class
 */
export class BaseScene {
  /**
   * Class Name
   */
  protected declare _name: string;

  /**
   * Base Three.js Scene
   *
   * @see {@link https://threejs.org/docs/#api/en/scenes/Scene}
   */
  protected declare _scene: Scene;

  /**
   * Canvas to paint to
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement}
   */
  protected declare _canvas: HTMLCanvasElement;

  /**
   * WebGLRenderer
   * @see {@link https://threejs.org/docs/#api/en/renderers/WebGLRenderer}
   */
  protected declare _renderer: WebGLRenderer;

  /**
   * Scene Camera
   *
   * @default PerspectiveCamera
   * @see {@link https://threejs.org/docs/#api/en/cameras/PerspectiveCamera}
   */
  protected declare _camera: Camera;

  /** Physics Adapter
   *
   * @see {@link PhysicsAdapter}
   */
  protected declare _physicsAdapter: PhysicsAdapter;

  /**
   * Scene Lights
   *
   * @see {@link https://threejs.org/docs/#api/en/lights/Light}
   */
  protected declare _lights: Light[];

  /**
   * Base GLTF Loader
   *
   * @see {@link https://threejs.org/docs/#examples/en/loaders/GLTFLoader}
   */
  protected declare _gltfLoader: GLTFLoader;

  /**
   * Debugging lines
   *
   * @see {@link https://threejs.org/docs/#api/en/objects/LineSegments}
   */
  protected declare _debugLines: LineSegments;

  /**
   * Create a BaseScene
   *
   * @property {HTMLCanvasElement} canvas - scene canvas\
   *
   * ⚠️ **NOTE**: {@link Engine} will call {@link init} after instantiation. ⚠️
   */
  constructor({
    canvas,
    physicsAdapter,
  }: {
    canvas: HTMLCanvasElement;
    physicsAdapter: PhysicsAdapter;
  }) {
    if (this.constructor === BaseScene) {
      throw new Error("Abstract classes can't be instantiated.");
    }

    this._name = this.constructor.name;
    this._physicsAdapter = physicsAdapter;
    this.#configureScene(canvas);
  }

  get name() {
    return this._name;
  }

  get debugLines() {
    return this._debugLines;
  }

  /**
   * Configure NyxScene
   */
  #configureScene = (canvas: HTMLCanvasElement) => {
    this._canvas = canvas;
    this._scene = createScene();
    this._camera = createCamera();
    this._gltfLoader = new GLTFLoader();
    this._debugLines = new LineSegments();
    this._renderer = createRenderer(canvas, 1);
  };

  /**
   * Add lights to the scene
   */
  #addLightsToScene = () => {
    this._lights.forEach((light) => this._scene.add(light));
  };

  /**
   * Initialize the scene
   */
  async init(): Promise<void> {
    this._lights = createLights();
    this.#addLightsToScene();
    this.update();
  }

  /**
   * Update the scene
   */
  update() {}
}

const createScene = () => {
  const scene = new Scene();

  // Configure scene.
  scene.background = new Color(0x2a2a2a);
  scene.fog = new Fog(0xffffff, 0, 750);

  return scene;
};

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
const createRenderer = (canvas: HTMLCanvasElement, scale: number = 1) => {
  const renderer = new WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(innerWidth * scale, innerHeight * scale, false);
  return renderer;
};
