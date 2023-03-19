import Stats from 'stats.js'

import { Debug } from '@webaverse-studios/debug'
import { PhysicsAdapter } from '@webaverse-studios/physics-core'

import { RenderScene } from './Scene'
import { WebGL } from './WebGL.js'
import { disableChromePerformanceBloat } from '../lib'

/**
 * @typedef {object} Time
 * @property {number} last The last time the engine was updated.
 * @property {number} delta The time in milliseconds since the last frame.
 * @property {number} elapsed The time in milliseconds since the engine started.
 */

export class Engine {
  stats = new Stats()

  isPlaying = false

  /**
   * @type {HTMLCanvasElement}
   */
  canvas

  /**
   * @type {RenderScene}
   */
  renderingScene

  /**
   * @type {PhysicsAdapter}
   */
  physicsAdapter

  /**
   * @type {Time}
   */
  time = { last: performance.now(), delta: 0, elapsed: 0 }

  /**
   * @type {number}
   */
  fps = 60

  /** @type {number} */
  fpsTolerance = 0.1

  /** @type {number} */
  dt = 0

  /**
   * @type {Map<number, RenderScene>}
   */
  #scenes = new Map()

  /**
   * Create a new Base Engine instance.
   *
   * @param {object} ops The options for the engine.
   * @param {number} [ops.width] The width of the canvas.
   * @param {number} [ops.height] The height of the canvas.
   * @param {boolean} [ops.debugMode] Run the engine in debug mode
   * @param {HTMLElement} ops.dom The dom element to render the scene on.
   * @param {HTMLCanvasElement} ops.canvas The canvas element to render
   * the scene on.
   * @param {PhysicsAdapter} [ops.physicsAdapter] The physics adapter to use.
   */
  constructor({
    dom,
    width,
    height,
    canvas,
    physicsAdapter,
    debugMode = false,
  }) {
    if ( !WebGL.isWebGLAvailable()) {
      console.error( 'WebGL Is not supported!' )
      const warning = WebGL.getWebGLErrorMessage()
      canvas.appendChild( warning )
      return
    }

    disableChromePerformanceBloat()

    this.canvas = canvas
    this.debugMode = debugMode
    this.physicsAdapter = physicsAdapter || new PhysicsAdapter()

    dom.appendChild( this.stats.dom )
    this.stats.showPanel( 0 )
    this.initializeCanvas({ height, width })
  }

  get scenes() {
    return this.#scenes
  }

  /**
   *
   * Initialize canvas for painting with engine.
   *
   * @param {object} params The parameters for the canvas.
   * @param {number} [params.height] The height of the canvas.
   * @param {number} [params.width] The width of the canvas.
   */
  initializeCanvas({ height, width }) {
    if ( height ) this.canvas.height = height
    if ( width ) this.canvas.width = width
    this.resize()
  }

  /**
   *
   * Load a scene into the engine
   *
   * @param {typeof RenderScene} RenderScene scene to load
   */
  async load( RenderScene ) {
    // Initialize Physics
    await this.physicsAdapter.init()

    this.#scenes.set(
      0,
      new RenderScene({
        canvas: this.canvas,
        physicsAdapter: this.physicsAdapter,
      })
    )
  }

  pause() {
    this.isPlaying = false
  }

  render() {}

  reset() {}

  resize( width = innerWidth, height = innerHeight ) {
    Debug.log( 'RESIZE' )

    this.canvas.width = width
    this.canvas.height = height
  }

  start() {
    this.reset()
    this.isPlaying = true

    if ( !this.renderingScene ) {
      Debug.error( 'No scene loaded for engine' )
    } else {
      Debug.log( `Scene ${this.renderingScene.name} is Starting` )
    }

    requestAnimationFrame(() => this.update())
  }

  stop() {
    this.isPlaying = false
  }

  update() {
    // Encapsulate context.
    const ctx = this

    /**
     *
     * Internal update loop
     *
     * @param {number} dt The time in milliseconds since the last frame.
     */
    // eslint-disable-next-line no-unused-vars
    function loop( dt ) {
      ctx.dt = dt

      // Run physics
      // ctx.physicsAdapter.update()

      // Run scene update
      ctx.stats.begin()
      // ctx.renderingScene.update()
      ctx.stats.end()

      // Debug.log( `[Engine Update]: delta: ${delta}` )
      if ( ctx.isPlaying ) requestAnimationFrame( loop )
    }

    requestAnimationFrame( loop )
  }
}
