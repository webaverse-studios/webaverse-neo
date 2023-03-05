import Stats from 'stats.js'
import {PhysicsManager} from "../../managers/Physics/index.js";


export class Engine {
  #stats = new Stats()
  #physicsManager = new PhysicsManager();

  canvas = null
  isPlaying = false

  constructor({canvas, dom, height, width}) {
    this.canvas = canvas

    dom.appendChild(this.#stats.dom)
    this.#stats.showPanel(0)

    this.initializeCanvas({height, width})
  }

  get physicsManager() {
    return this.#physicsManager;
  }

  initializeCanvas({height, width}) {
    if (height) this.canvas.height = height
    if (width) this.canvas.width = width

    this.resize()
  }

  load(Scene) {
    this.scene = new Scene({
      canvas: this.canvas,
    })
  }

  pause() {
    this.isPlaying = false
  }

  render() {
  }

  reset() {
  }

  resize(
    width = innerWidth,
    height = innerHeight,
  ) {
    console.log('RESIZE',)
    const {devicePixelRatio} = window

    this.canvas.width = width
    this.canvas.height = height
  }

  start() {
    this.reset()
    this.isPlaying = true

    requestAnimationFrame(() => this.update(this))
  }

  stop() {
    this.isPlaying = false
  }

  update() {
    this.#stats.begin()
    this.scene.update()
    this.#stats.end()

    if (this.isPlaying)
      requestAnimationFrame(() => this.update())
  }
}
