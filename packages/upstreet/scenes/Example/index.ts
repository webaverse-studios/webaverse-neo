import {
  AmbientLight,
  Color,
  Fog,
  Object3D,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
} from "three";

import { NyxScene } from "../nyx-scene";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { loadGeometry } from "./geometry";

export class Example extends NyxScene {
  declare cube: Object3D;
  declare camera: PerspectiveCamera;

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    super({ canvas });
  }

  /**
   * Configure NyxScene
   */
  private configureNyxScene = () => {
    this.scene = createScene();
    this.camera = createCamera();
    this.lights = createLights();
    this.renderer = createRenderer(this.canvas, 1);
  };

  /**
   * Load GLTF Model and return Object3D
   */
  private initCube = async () => {
    this.cube = await createCube(this.gltfLoader);
    this.scene.add(this.cube);
  };

  /**
   * Add lights to the scene
   */
  private addLightsToScene = () => {
    this.lights.forEach((light) => this.scene.add(light));
  };

  /**
   * Initialize everything in the scene
   */
  async init(): Promise<void> {
    await Promise.all([
      this.configureNyxScene(),
      await this.initCube(),
      this.addLightsToScene(),
    ]);

    this.update();
  }

  update() {
    this.cube.rotation.x += 0.004;
    this.cube.rotation.y += 0.004;
    this.renderer.render(this.scene, this.camera);
  }
}

const createCamera = () => {
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 10;
  return camera;
};

const createLights = () => {
  const light1 = new PointLight(0xffffff, 1, 0, 2),
    light2 = new PointLight(0xffffff, 1, 0, 2),
    light3 = new AmbientLight(0xffffff, 2);

  light1.position.set(5 * Math.random(), 5 * Math.random(), 10);
  light1.castShadow = true;

  light2.position.set(5 * Math.random(), 10 * Math.random(), 10);
  light2.castShadow = true;

  return [light1, light2, light3];
};

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

const createCube = async (loader: GLTFLoader) => {
  const cube = await loadGeometry(loader);
  return cube.scene.getObjectByName("Cube")!;
};
