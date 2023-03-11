import {
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
} from "three";

import { VRM } from "@pixiv/three-vrm";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PhysicsAdapter } from "@webaverse-studios/physics-core";
import { AvatarCharacter, Scene } from '@webaverse-studios/engine-nyx'

import { loadGeometry } from "./geometry";


import {
  createCamera,
  createControls,
  createDebugLines,
  createLights,
  createRenderer,
  createScene,
} from "./setup";

/**
 * Grid Scene to display a grid and avatar.
 */
export class Grid extends Scene {
  declare _grid: GLTF;
  declare _avatar: VRM;
  declare _controls: OrbitControls;
  declare _camera: PerspectiveCamera;
  declare _character: AvatarCharacter;
  declare _lines: LineSegments<BufferGeometry, LineBasicMaterial>;

  /**
   * Create Grid Scene to display a grid and avatar.
   *
   * @property {HtmlCanvasElement} canvas
   */
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
   * Configure scene
   */
  private async configureScene() {
    const [scene, camera, lights, lines, renderer] = await Promise.all([
      createScene(),
      createCamera(),
      createLights(),
      createDebugLines(),
      createRenderer(this._canvas, 1),
    ]);

    this._lines = lines;
    this._scene = scene;
    this._camera = camera;
    this._lights = lights;
    this._renderer = renderer;
    this._controls = createControls(camera, renderer);
  }

  /**
   * Load GLTF Model and return Object3D
   */
  private async initGeometry() {
    const { avatar, grid } = await loadGeometry(this._gltfLoader);
    this._avatar = avatar;
    this._grid = grid;
  }

  /**
   * Manipulate the geometry to display the grid and avatar.
   */
  private configureGeometry() {
    // rotate to face the camera
    this._avatar.scene.rotation.y = Math.PI;

    const scale = 5;
    this._grid.scene.scale.set(scale, scale, scale);
    this._grid.scene.position.set(0, 0, 0);
    this._grid.scene.rotation.set(0, 0, 0);

    this._scene.add(this._lines);
    this._scene.add(this._avatar.scene);
    this._scene.add(this._grid.scene);
  }

  private configureCharacter() {
    this._character = new AvatarCharacter({
      avatar: this._avatar,
      physicsAdapter: this._physicsAdapter,
    });
  }

  /**
   * Add lights to the scene
   */
  private addLightsToScene() {
    this._lights.forEach((light) => this._scene.add(light));
  }

  async init(): Promise<void> {
    await Promise.all([
      this.configureScene(),
      this.initGeometry(),
    ]);

    this.addLightsToScene();
    this.configureGeometry();
    this.configureCharacter();

    // function down(this: Grid, event: KeyboardEvent) {
    //   if (event.key == "ArrowUp") this.movementDirection.x = this.speed;
    //   if (event.key == "ArrowDown") this.movementDirection.x = -this.speed;
    //   if (event.key == "ArrowLeft") this.movementDirection.z = -this.speed;
    //   if (event.key == "ArrowRight") this.movementDirection.z = this.speed;
    //   if (event.key == " ") this.movementDirection.y = this.speed;
    // }

    // function up(this: Grid, event: KeyboardEvent) {
    //   if (event.key == "ArrowUp") this.movementDirection.x = 0.0;
    //   if (event.key == "ArrowDown") this.movementDirection.x = 0.0;
    //   if (event.key == "ArrowLeft") this.movementDirection.z = 0.0;
    //   if (event.key == "ArrowRight") this.movementDirection.z = 0.0;
    //   if (event.key == " ") this.movementDirection.y = -this.speed; // Gravity
    // }

    // document.onkeyup = up.bind(this);
    // document.onkeydown = down.bind(this);

    this.update();
  }

  private render() {
    this._physicsAdapter.displayDebugInformation(this);
    this._renderer.render(this._scene, this._camera);
  }

  // speed = 0.1;
  // movementDirection = new Vector3(0.0, -0.1, 0.0);

  update() {
    // this._character.update(this.movementDirection);
    this._controls.update();
    this.render();
  }
}
