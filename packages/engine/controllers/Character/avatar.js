import {BaseCharacter} from "./base.js";
import * as THREE from "three";
import feathers from "@feathersjs/client"
import auth from "@feathersjs/authentication-client"
import io from "socket.io-client"

const socket = io('http://localhost:3030')
const feathersClient = feathers(socket);
feathersClient.configure(feathers.socketio(socket))
feathersClient.configure(auth())
feathersClient.authenticate({
  strategy: 'local',
  email: 'admin',
  password: 'admin'

}).then((result) => {
  console.log('AUTHENTICATED', result)
}).catch((error) => {
  console.error('ERROR', error)
})

/**
 * @class AvatarCharacter
 */
export class AvatarCharacter extends BaseCharacter {
  /**
   * Create a new avatar character controller.
   *
   * @param {Engine} engine
   */
  constructor({engine}) {
    super({engine});

    this.avatar = engine.avatar
    this.offscreenCanvas = new OffscreenCanvas(1024, 1024)
    this.renderer = new THREE.WebGLRenderer({canvas: this.offscreenCanvas})
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderManager = () => {
      this.renderAvatarView()
    }
    addEventListener('keydown', function (event) {
      console.log('KEYDOWN', event.key)
      if (event.key === 'Enter') {
        console.log('ENTER')
        renderManager()
      }
    })
  }

  // function that renders the view from the avatar's perspective
  async renderAvatarView() {
    // render the avatar
    console.log("RENDERING AVATAR VIEW")
    console.log(this)
    const position = this.position
    const rotation = this.rotation
    console.log('POSITION', position, 'ROTATION', rotation)


    this.camera.position.set(position.x, position.y + 2, position.z) // faked height, will need to decapitate the avatar and get height in the future
    this.camera.rotation.set(rotation.x, rotation.y, rotation.z)
    this.camera.up = this.up
    this.renderer.render(this.engine.scene.scene, this.camera)
    // get the image data from the offscreencanvas
    const imageBlob = await this.offscreenCanvas.convertToBlob()

    console.log('IMAGE BLOB', imageBlob)
    // send blob to feathers server
    const data = {
      hash_condition: this.playerId,
      file: imageBlob,
      metadata: {
        type: imageBlob.type,
        size: imageBlob.size,
      },
    }
    const image = await feathersClient.service('files').create(data)
    console.log('IMAGE', image)
    this.renderer.clear()


  }
}
