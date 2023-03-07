import {Engine} from '../Engine/index.js'
import {AvatarCharacter} from "../../controllers/Character/avatar.js";
import {Physx} from "../../managers/Physics/physx.js";


export class NyxEngine extends Engine {
  constructor({canvas, dom, height, width}) {
    super({canvas, dom, height, width})
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

  resize(width, height) {
    super.resize(width, height)
  }

  async start() {
    await new Promise(async (resolve) => {
      console.log('WAITING FOR PHYSX LOAD')
      await Physx.waitForLoad()
      console.log('PHYSX LOADED')
      resolve()
    })

    super.start()
    console.log('START!, this.scene: ', this.scene)

    this.avatar = new AvatarCharacter({engine: this})
    // this.avatar.renderAvatarView()
    // console.log('AVATAR')
  }

  stop() {
    super.stop()
  }

  update() {
    super.update()
  }
}
