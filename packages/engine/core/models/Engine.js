import Stats from 'stats.js'

import { Debug } from '@webaverse-studios/debug'
import { PhysicsAdapter } from '@webaverse-studios/physics-core'

import { RenderingScene } from './Scene'
import { WebGL } from './WebGL.js'
import { disableChromePerformanceBloat } from '../lib'

export class Engine {
  #stats = new Stats()

  isPlaying = false

  /**
   * @type {HTMLCanvasElement}
   */
  canvas

  /**
   * @type {RenderingScene}
   */
  renderingScene

  /**
   * @type {PhysicsAdapter}
   */
  physicsAdapter

  /**
   * Create a new Base Engine instance.
   *
   * @param {object} engineOptions The options for the engine.
   * @param {number} [engineOptions.width] The width of the canvas.
   * @param {number} [engineOptions.height] The height of the canvas.
   * @param {HTMLElement} engineOptions.root The root DOM element to attach
   * elements to.
   * @param {HTMLCanvasElement} engineOptions.canvas The canvas element to
   * render the scene on.
   * @param {PhysicsAdapter} engineOptions.physicsAdapter The physics adapter
   * to use.
   */
  constructor({ root, width, height, canvas, physicsAdapter }) {
    if ( !WebGL.isWebGLAvailable()) {
      console.error( 'WebGL Is not supported!' )
      const warning = WebGL.getWebGLErrorMessage()
      canvas.appendChild( warning )
      return
    }

    disableChromePerformanceBloat()

    this.canvas = canvas
    this.physicsAdapter = physicsAdapter || new PhysicsAdapter()

    root.appendChild( this.#stats.dom )
    this.#stats.showPanel( 0 )
    this.initializeCanvas({ height, width })
  }

  /**
   *
   * Initialize canvas for painting with engine.
   *
   * @param {object} params The parameters for the canvas.
   * @param {number} params.height The height of the canvas.
   * @param {number} params.width The width of the canvas.
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
   * @param {typeof RenderingScene} RenderingScene scene to load
   */
  async load( RenderingScene ) {
    const t0 = performance.now()

    // Initialize Physics
    await this.physicsAdapter.init()

    this.renderingScene = new RenderingScene({
      canvas: this.canvas,
      physicsAdapter: this.physicsAdapter,
    })

    if ( typeof this.renderingScene?.init === 'function' ) {
      await this.renderingScene?.init()
    }

    const t1 = performance.now()

    Debug.log(
      `Finished Loading of scene: ${RenderingScene.name} in ${t1 - t0}ms`
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

    let delta = 0,
      lastTime = 0

    /**
     *
     * Internal update loop
     *
     * @param {number} time The time in milliseconds since the last frame.
     */
    // eslint-disable-next-line no-unused-vars
    function loop( time ) {
      delta = time - lastTime
      lastTime = time

      // Run physics
      ctx.physicsAdapter.update()

      // Run scene update
      ctx.#stats.begin()
      ctx.renderingScene.update()
      ctx.#stats.end()

      if ( ctx.isPlaying ) requestAnimationFrame( loop )
    }

    requestAnimationFrame( loop )
  }
}
