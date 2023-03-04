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
  constructor({ canvas, height, width }) {
    super({ canvas, height, width })
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
  stop() {}
  update() {}
}
