import { PhysicsAdapter } from "@webaverse-studios/physics-core";
import Stats from "stats.js";

import { Scene as BaseScene } from "./scenes";
import WebGL from "./utils/WebGL";
import { RapierPhysicsAdapter } from "@webaverse-studios/physics-rapier";

export * from './scenes'
export * from './controllers'

export interface EngineOptions {
  dom: Element;
  height?: number;
  width?: number;
  canvas: HTMLCanvasElement;
  physicsAdapter: PhysicsAdapter;
}

export class Engine {
  #stats = new Stats();
  isPlaying = false;

  declare canvas: HTMLCanvasElement;
  declare scene: Scene | undefined;
  declare physicsAdapter: PhysicsAdapter;

  /**
   *  Create a new Base Engine instance.
   *
   * @property {canvas} HtmlCanvasElement
   * @property {dom} HTMLElement
   * @property {height} Number
   * @property {width} Number
   */
  constructor({
    dom,
    width,
    height,
    canvas,
    physicsAdapter = new RapierPhysicsAdapter(),
  }: EngineOptions) {
    if (!WebGL.isWebGLAvailable()) {
      console.error("WebGL Is not supported!");
      const warning = WebGL.getWebGLErrorMessage();
      canvas.appendChild(warning);
      return;
    }

    this.canvas = canvas;
    this.physicsAdapter = physicsAdapter;

    dom.appendChild(this.#stats.dom);
    this.#stats.showPanel(0);
    this.initializeCanvas({ height, width });
  }

  initializeCanvas({ height, width }: { height?: number; width?: number }) {
    if (height) this.canvas.height = height;
    if (width) this.canvas.width = width;
    this.resize();
  }

  async load(Scene: typeof BaseScene) {
    const t0 = performance.now();

    this.scene = new Scene({
      canvas: this.canvas,
      physicsAdapter: this.physicsAdapter,
    });

    if (typeof this.scene?.init === "function") {
      await this.scene?.init();
    }

    const t1 = performance.now();

    console.log(`Finished Loading of scene: ${Scene.name} in ${t1 - t0}ms`);
  }

  pause() {
    this.isPlaying = false;
  }

  render() {}

  reset() {}

  resize(width = innerWidth, height = innerHeight) {
    console.log("RESIZE");

    this.canvas.width = width;
    this.canvas.height = height;
  }

  start() {
    this.reset();
    this.isPlaying = true;

    if (!this.scene) {
      console.error("No scene loaded for engine");
    } else {
      console.log(`Scene ${this.scene.name} is Starting`);
    }

    requestAnimationFrame(() => this.update());
  }

  stop() {
    this.isPlaying = false;
  }

  update() {
    // Encapsulate context.
    const ctx = this

    let
      delta = 0,
      lastTime = 0;

    function loop( time ) {
      // delta = time - lastTime;
      // lastTime = time;

      // Run physics
      ctx.physicsAdapter.update();

      // Run scene update
      ctx.#stats.begin();
      ctx.scene!.update();
      ctx.#stats.end();

      if ( ctx.isPlaying )
        requestAnimationFrame( loop );
    }

    requestAnimationFrame( loop );
  }
}
