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
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { PhysicsAdapter } from "@webaverse-studios/physics-core";

import { NyxScene } from "../nyx-scene";
import { loadGeometry } from "./geometry";

export class Example extends NyxScene {
  declare _cube: Object3D;
  declare _camera: PerspectiveCamera;

  constructor({
    canvas,
    physicsAdapter,
  }: {
    canvas: HTMLCanvasElement;
    physicsAdapter: PhysicsAdapter;
  }) {
    super({ canvas, physicsAdapter });
  }

  /**
   * Configure NyxScene
   */
  private configureNyxScene() {
    this._scene = createScene();
    this._camera = createCamera();
    this._lights = createLights();
    this._renderer = createRenderer(this._canvas, 1);
  }

  /**
   * Load GLTF Model and return Object3D
   */
  private async initCube() {
    this._cube = await createCube(this._gltfLoader);
    this._scene.add(this._cube);
  }

  /**
   * Add lights to the scene
   */
  private addLightsToScene() {
    this._lights.forEach((light) => this._scene.add(light));
  }

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
    this._cube.rotation.x += 0.004;
    this._cube.rotation.y += 0.004;
    this._renderer.render(this._scene, this._camera);
  }
}

function createCamera() {
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 10;
  return camera;
}

function createLights() {
  const light1 = new PointLight(0xffffff, 1, 0, 2),
    light2 = new PointLight(0xffffff, 1, 0, 2),
    light3 = new AmbientLight(0xffffff, 2);

  light1.position.set(5 * Math.random(), 5 * Math.random(), 10);
  light1.castShadow = true;

  light2.position.set(5 * Math.random(), 10 * Math.random(), 10);
  light2.castShadow = true;

  return [light1, light2, light3];
}

function createRenderer(canvas: HTMLCanvasElement, scale = 1) {
  const renderer = new WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(innerWidth * scale, innerHeight * scale, false);
  return renderer;
}

function createScene() {
  const scene = new Scene();

  // Configure scene.
  scene.background = new Color(0x2a2a2a);
  scene.fog = new Fog(0xffffff, 0, 750);

  return scene;
}

async function createCube(loader: GLTFLoader) {
  const cube = await loadGeometry(loader);
  return cube.scene.getObjectByName("Cube")!;
}
