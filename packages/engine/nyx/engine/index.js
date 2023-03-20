import { Engine } from '@webaverse-studios/engine-core'
import { PhysicsAdapter } from '@webaverse-studios/physics-rapier'

export class NyxEngine extends Engine {
  /**
   * Create a new NyxEngine instance.
   *
   * @param {object} options The options for the engine.
   * @param {HTMLCanvasElement} options.canvas The canvas element to render
   * the scene on.
   * @param {HTMLElement} options.dom The dom element to render the scene on.
   * @param {number} [options.height] The height of the canvas.
   * @param {number} [options.width] The width of the canvas.
   */
  constructor({ canvas, dom, height, width }) {
    // Use Rapier physics adapter
    let physicsAdapter = new PhysicsAdapter()

    super({
      canvas,
      dom,
      height,
      width,
      physicsAdapter,
    })
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

  /**
   * Resize the canvas.
   *
   * @param {number} [width] The width of the canvas.
   * @param {number} [height] The height of the canvas.
   */
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
