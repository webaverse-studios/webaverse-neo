import { Engine } from '@webaverse-studios/engine-base'

export class NyxEngine extends Engine {
  /**
   *  Create a new NyxEngine instance.
   *
   * @property {HtmlCanvasElement} canvas
   * @property {HTMLElement} dom
   * @property {number} height
   * @property {number} width
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
    super({ canvas, dom, height, width })
  }

  pause () {
    super.pause()
  }

  render () {
    super.render()
  }

  reset () {
    super.reset()
  }

  resize (width?: number, height?: number) {
    super.resize(width, height)
  }

  async start () {
    super.start()
    console.log('START!')
  }

  stop () {
    super.stop()
  }

  update () {
    super.update()
  }
}
