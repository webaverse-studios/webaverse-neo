import {
  AmbientLight,
  Color,
  Fog,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer
} from 'three'

import { Engine } from '../Engine/index.js'


export class NyxEngine extends Engine {
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
  start() {
    super.start()
    console.log( 'START!',  )
  }
  stop() {
    super.stop()
  }
  update() {
    super.update()
  }
}
