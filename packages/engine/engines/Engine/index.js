
export class Engine {
  canvas = null

  constructor({ canvas, height, width }) {
    this.canvas = canvas

    this.initializeCanvas({ height, width })
  }

  initializeCanvas({ height, width }) {
    if ( height ) this.canvas.height = height
    if ( width ) this.canvas.width = width

    this.resize()
  }

  load( Scene ) {
    this.scene = new Scene({
      canvas: this.canvas,
    })
  }

  pause() {}

  render() {}

  reset() {}

  resize(
    width = this.canvas.width,
    height = this.canvas.height,
  ) {
    const { devicePixelRatio } = window

    this.canvas.width = width * devicePixelRatio
    this.canvas.height = height * devicePixelRatio
  }

  start() {
    this.reset()
  }

  stop() {}

  update() {}
}
