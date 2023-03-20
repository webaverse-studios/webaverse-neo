import * as bitECS from 'bitecs'
import Stats from 'stats.js'

import { Debug } from '@webaverse-studios/debug'
import { SceneComponent, renderSystem } from '@webaverse-studios/ecs'
import { PhysicsAdapter } from '@webaverse-studios/physics-core'

import { RenderScene } from './Scene'
import { WebGL } from './WebGL.js'
import { disableChromePerformanceBloat } from '../lib'

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

  /**
   * @type {Map<number, RenderScene>}
   */
  #scenes = new Map()

  /**
   * @type {bitECS.IWorld}
   */
  #world

  #systems = [renderSystem]

  #pipeline = bitECS.pipe( ...this.#systems )

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
    this.#world = bitECS.createWorld( this )
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
   * Add a scene to the engine
   *
   * @param {import('./Scene').RenderScene} RenderScene scene to load
   */
  #addScene( RenderScene ) {
    const sceneId = bitECS.addEntity( this.#world )
    bitECS.addComponent( this.#world, SceneComponent, sceneId )

    const renderingScene = new RenderScene({
      canvas: this.canvas,
      physicsAdapter: this.physicsAdapter,
    })

    renderingScene._engine = this
    this.#scenes.set( sceneId, renderingScene )
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
   * @param {RenderScene} RenderScene scene to load
   */
  async load( RenderScene ) {
    this.#addScene( RenderScene )
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
    requestAnimationFrame(() => this.update())
  }

  stop() {
    this.isPlaying = false
  }

  /**
   * Add a system to the engine.
   *
   * @param {(engine: Engine) => Promise<Engine>} system The system to add to
   * the engine.
   */
  addSystem( system ) {
    this.#systems.push( system )
    this.#pipeline = bitECS.pipe( ...this.#systems )
  }

  update() {
    // Encapsulate context.
    const ctx = this

    const fpsTolerance = 0.1
    var then = performance.now()
    const interval = 1000 / ctx.fps

    /**
     *
     * Internal update loop
     *
     * @param {number} dt The time in milliseconds since the last frame.
     */
    function loop( dt ) {
      const delta = dt - then

      if ( delta >= interval - fpsTolerance ) {
        then = dt - ( delta % interval )
        ctx.#pipeline( ctx.#world )
      }

      if ( ctx.isPlaying ) requestAnimationFrame( loop )
    }

    requestAnimationFrame( loop )
  }
}
