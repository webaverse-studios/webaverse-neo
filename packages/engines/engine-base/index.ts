import Stats from 'stats.js'
import { BaseScene } from './scenes'
import WebGL from './utils/WebGL'

export class Engine {
  // # Private #
  #stats = new Stats()

  // # Public #
  isPlaying = false

  scene: BaseScene | undefined
  canvas!: HTMLCanvasElement

  /**
   *  Create a new Base Engine instance.
   *
   * @property {canvas} HtmlCanvasElement
   * @property {dom} HTMLElement
   * @property {height} Number
   * @property {width} Number
   */
  constructor ({
    canvas,
    dom,
    height,
    width
  }: {
    dom: Element
    height?: number
    width?: number
    canvas: HTMLCanvasElement
  }) {
    if (!WebGL.isWebGLAvailable()) {
      console.error('WebGL Is not supported!')
      const warning = WebGL.getWebGLErrorMessage()
      canvas.appendChild(warning)
      return
    }

    this.canvas = canvas

    dom.appendChild(this.#stats.dom)
    this.#stats.showPanel(0)

    this.initializeCanvas({ height, width })
  }

  initializeCanvas ({ height, width }: { height?: number; width?: number }) {
    if (height) this.canvas.height = height
    if (width) this.canvas.width = width
    this.resize()
  }

  async load<S extends typeof BaseScene> (Scene: S) {
    console.log(`Starting Loading of scene: ${Scene.name}`)
    this.scene = new Scene({
      canvas: this.canvas
    })

    if (typeof this.scene?.init === 'function') {
      await this.scene?.init()
    }

    console.log(`Finished Loading of scene: ${Scene.name}`)
  }

  pause () {
    this.isPlaying = false
  }

  render () {}

  reset () {}

  resize (width = innerWidth, height = innerHeight) {
    console.log('RESIZE')

    this.canvas.width = width
    this.canvas.height = height
  }

  start () {
    this.reset()
    this.isPlaying = true

    if (!this.scene) {
      console.error('No scene loaded for engine')
    } else {
      console.log(`Scene ${this.scene.name} is Starting`)
    }

    requestAnimationFrame(() => this.update())
  }

  stop () {
    this.isPlaying = false
  }

  update () {
    this.#stats.begin()
    this.scene!.update()
    this.#stats.end()

    if (this.isPlaying) requestAnimationFrame(() => this.update())
  }
}
