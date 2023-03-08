import Stats from 'stats.js'
import { BaseScene } from './scenes'
import WebGL from './utils/WebGL'

export class Engine {
  // # Private #

  // # Public #
  isPlaying = false
  #stats = new Stats()

  scene: BaseScene | undefined
  canvas: HTMLCanvasElement

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
    canvas: HTMLCanvasElement
    dom: Element
    height?: number
    width?: number
  }) {
    if (!WebGL.isWebGLAvailable()) {
      const warning = WebGL.getWebGLErrorMessage()
      canvas.appendChild(warning)
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
    this.scene = new Scene({
      canvas: this.canvas
    })
    await this.scene?.init()
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
      requestAnimationFrame(() => this.update())
    }
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
