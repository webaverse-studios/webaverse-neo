import Stats from 'stats.js'
import { Debug } from '@webaverse-studios/debug'
import { PhysicsAdapter } from '@webaverse-studios/physics-rapier'

import { disableChromePerformanceBloat } from '../lib'
import { WebGL } from './WebGL.js'

export class Engine {
  #stats = new Stats()

  isPlaying = false
  debugMode = false

  /**
   * @type {HTMLCanvasElement}
   */
  canvas

  /**
   * @type {Scene}
   */
  scene

  /**
   * @type {PhysicsAdapter}
   */
  physicsAdapter

  /**
   * Create a new Base Engine instance.
   *
   * @param {object} engineOptions The options for the engine.
   * @param {number} engineOptions.width The width of the canvas.
   * @param {number} engineOptions.height The height of the canvas.
   * @param {boolean} engineOptions.debugMode Run the engine in debug mode
   * @param {HTMLElement} engineOptions.root The root DOM element to attach
   * elements to.
   * @param {HTMLCanvasElement} engineOptions.canvas The canvas element to
   * render the scene on.
   * @param {PhysicsAdapter} engineOptions.physicsAdapter The physics adapter
   * to use.
   */
  constructor({ root, width, height, canvas, physicsAdapter, debugMode = false }) {
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

    dom.appendChild( this.#stats.dom )
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
   * @param {Scene} Scene scene to load
   */
  async load( Scene ) {
    const t0 = performance.now()

    // Initialize Physics
    await this.physicsAdapter.init()

    this.scene = new Scene({
      canvas: this.canvas,
      physicsAdapter: this.physicsAdapter,
    })

    if ( typeof this.scene?.init === 'function' ) {
      await this.scene?.init()
    }

    const t1 = performance.now()

    if ( this.debugMode )
      Debug.log( `Finished Loading of scene: ${Scene.name} in ${t1 - t0}ms` )
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

    if ( this.debugMode ) {
      if ( !this.scene ) {
        Debug.error( 'No scene loaded for engine' )
      } else {
        Debug.log( `Scene ${this.scene.name} is Starting` )
      }
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
      ctx.scene.update()
      ctx.#stats.end()

      if ( ctx.debugMode ) Debug.log( `[Engine Update]: delta: ${delta}` )
      if ( ctx.isPlaying ) requestAnimationFrame( loop )
    }

    requestAnimationFrame( loop )
  }
}
