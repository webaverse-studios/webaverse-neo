import DomItem from './DomItem.js'

export class DomRenderEngine extends EventTarget {
  constructor () {
    super()

    this.doms = []
    this.physicsObjects = []
    this.lastHover = false
  }

  static getScaleFactor (width, height) {
    return Math.min(1 / width, 1 / height)
  }

  addDom ({
    position = new THREE.Vector3(),
    quaternion = new THREE.Quaternion(),
    scale = new THREE.Vector3(1, 1, 1),
    width = 600,
    height = 400,
    worldWidth = 1,
    render
    // render = () => <div /> // TODO: WTF is this?
  }) {
    const dom = new DomItem(
      position,
      quaternion,
      scale,
      width,
      height,
      worldWidth,
      render
    )
    this.doms.push(dom)
    this.physicsObjects.push(dom.physicsObject)

    this.dispatchEvent(new MessageEvent('update'))

    globalThis.dom = dom

    return dom
  }

  removeDom (dom) {
    const index = this.doms.indexOf(dom)
    if (index !== -1) {
      this.doms.splice(index, 1)
      this.physicsObjects.splice(index, 1)
    }
  }

  /* update() {
    const hover = this.doms.some(dom => {
      return false;
    });
    if (hover !== this.lastHover) {
      this.lastHover = hover;

      this.dispatchEvent(new MessageEvent('hover', {
        data: {
          hover,
        },
      }));
    }
  } */

  getPhysicsObjects () {
    return this.physicsObjects
  }

  onBeforeRaycast () {
    for (const dom of this.doms) {
      dom.onBeforeRaycast()
    }
  }

  onAfterRaycast () {
    for (const dom of this.doms) {
      dom.onAfterRaycast()
    }
  }

  destroy () {
    // XXX finish this
  }
}

const domRenderer = new DomRenderEngine()
export default domRenderer
