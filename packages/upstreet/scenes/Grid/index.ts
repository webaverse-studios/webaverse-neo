import { AmbientLight, Color, Fog, PerspectiveCamera, PointLight } from "three";

import { loadGeometry } from "./geometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { NyxScene } from "../nyx-scene";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { VRM } from "@pixiv/three-vrm";

/**
 * Grid Scene to display a grid and avatar.
 */
export class Grid extends NyxScene {
  grid!: GLTF;
  avatar!: VRM;
  controls!: OrbitControls;

  /**
   * Create Grid Scene to display a grid and avatar.
   *
   * @property {HtmlCanvasElement} canvas
   */
  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    super({ canvas });
  }

  update() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  async init() {
    await Promise.all([
      initCamera.apply(this),
      initRenderer.apply(this),
      initLights.apply(this),
      initGeometry.apply(this),
    ]);

    configureScene.apply(this);
    this.update();
  }
}

/**
 * Initialize Scene Renderer
 */
async function initRenderer(this: Grid, scale = 1) {
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.setSize(innerWidth * scale, innerHeight * scale, false);
}

/**
 * Initialize Scene Camera
 */
async function initCamera(this: Grid) {
  this.camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  this.camera.position.y = 2;
  this.camera.position.z = 3;
}

/**
 * Initialize Scene Lights
 */
async function initLights(this: Grid): Promise<void> {
  const light1 = new PointLight(0xffffff, 1, 0, 2),
    light2 = new PointLight(0xffffff, 1, 0, 2),
    light3 = new AmbientLight(0xffffff, 2);

  light1.position.set(5 * Math.random(), 5 * Math.random(), 10);
  light1.castShadow = true;

  light2.position.set(5 * Math.random(), 10 * Math.random(), 10);
  light2.castShadow = true;

  this.lights = [light1, light2, light3];

  this.scene.add(light1);
  this.scene.add(light2);
  this.scene.add(light3);
}

/**
 * Initialize Scene Geometry
 */
async function initGeometry(this: Grid) {
  const { avatar, grid } = await loadGeometry(this.gltfLoader);
  this.avatar = avatar;
  this.grid = grid;
}

/**
 * Configure Scene after initialization
 */
function configureScene(this: Grid) {
  // Configure scene.
  this.scene.background = new Color(0x2a2a2a);
  this.scene.fog = new Fog(0xffffff, 0, 750);

  // rotate to face the camera
  this.avatar.scene.rotation.y = Math.PI;

  const scale = 5;
  this.grid.scene.scale.set(scale, scale, scale);
  this.grid.scene.position.set(0, 0, 0);
  this.grid.scene.rotation.set(0, 0, 0);

  this.scene.add(this.avatar.scene);
  this.scene.add(this.grid.scene);

  // Controls
  this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  this.controls.listenToKeyEvents(window); // optional

  this.controls.rotateSpeed = 1.0;
  this.controls.zoomSpeed = 1.2;
  this.controls.panSpeed = 0.8;

  this.controls.keys = {
    LEFT: "KeyA", //left arrow
    UP: "KeyW", // up arrow
    RIGHT: "KeyD", // right arrow
    BOTTOM: "KeyS", // down arrow
  };
}
