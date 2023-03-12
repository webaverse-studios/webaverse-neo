import { Engine } from '@webaverse-studios/engine-core'

export class NyxEngine extends Engine {
  /**
   *  Create a new NyxEngine instance.
   *
   * @param {object} nyxEngineOptions - The options for the engine.
   * @param {HTMLCanvasElement} nyxEngineOptions.canvas - The canvas element to render the scene on.
   * @param {HTMLElement} nyxEngineOptions.dom - The dom element to render the scene on.
   * @param {number} nyxEngineOptions.height - The height of the canvas.
   * @param {number} nyxEngineOptions.width - The width of the canvas.
   */
  constructor({ canvas, dom, height, width }) {
    super({ canvas, dom, height, width })
  }

  pause() {
    super.pause()
  }

  render() {
    super.render()
  }

  reset() {
    super.reset()
  }

  resize( width, height ) {
    super.resize( width, height )
  }

  async start() {
    super.start()
    // eslint-disable-next-line no-console
    console.log( '[NYX_ENGINE]: START!' )
  }

  stop() {
    super.stop()
  }

  update() {
    super.update()
  }
}
