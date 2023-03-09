import feathers from "@feathersjs/client"
import auth from "@feathersjs/authentication-client"
import io from "socket.io-client"

import * as THREE from "three";
import GUN from 'gun'

export class Agent {
  // agent class that handles AI agents that can be given API access to a game server

  constructor({engine}) {
    this.engine = engine
    this.avatar = engine.avatar
    console.log('this.avatar: ', this.avatar)

    // feathers client
    const socket = io('http://localhost:3030')
    this.feathers = feathers(socket);
    this.feathers.configure(feathers.socketio(socket))
    this.feathers.configure(auth())
    this.feathers.authenticate({
      strategy: 'local',
      email: 'admin',
      password: 'admin'
    }).then((result) => {
      console.log('AUTHENTICATED', result)
    }).catch((error) => {
      console.error('ERROR', error)
    })

    // gun client
    this.gun = GUN({peers: ['http://localhost:3401/gun']})
    const createGunAgent = async () => {
      await this.gun.get('agents').get(this.avatar.playerId)
    }
    createGunAgent()


    this.offscreenCanvas = new OffscreenCanvas(1024, 1024)
    this.renderer = new THREE.WebGLRenderer({canvas: this.offscreenCanvas})
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)

    const timestamp = 1234


    const renderManager = async () => {
      await this.renderAvatarView()
    }

    const memorizeManager = async () => {
      const imageBlob = await this.offscreenCanvas.convertToBlob()
      const data = {
        hash_condition: {agentID: this.avatar.playerId, timestamp: Date.now()},
        file: imageBlob,
        metadata: {
          type: imageBlob.type,
          size: imageBlob.size,
        }
      }
      console.log('data: ', data)
      await this.memorize(timestamp, {image:data})
    }

    const rememberManager = async () => {
      await this.remember(timestamp)
    }

    const clearRenderer = () => {
      this.renderer.clear()
    }

    addEventListener('keydown', function (event) {
      console.log('KEYDOWN', event.key)
      if (event.key === 'Enter') {
        console.log('ENTER')
        renderManager()
      }
      if (event.key === ' ') {
        console.log('SPACE')
        memorizeManager()
      }

      if (event.key === 'Shift') {
        console.log('Shift')
        rememberManager()
      }

      if (event.key === 'Backspace') {
        console.log('Backspace')
        clearRenderer()
      }
    })
  }

  async memorize(timestamp, memory){
    console.log('addMemoryToDB', timestamp, memory)
    // add a memory to the feathers (caching files) and then storing the hash in gun
    for (const key of Object.keys(memory)) {
      console.log('key', key, memory[key])
      const response = await this.feathers.service('files').create(memory[key])
      console.log('response', response, response.id)
      const gun_response = await this.gun.get("agents").get(this.avatar.playerId).get("memories").get(timestamp).get(key).put(response.id, function(ack){
        console.log('ACK', ack)
      })
      console.log('gun_response', gun_response)
    }
  }

  async remember(timestamp) {
    // get the ids from the gun DB based on the timestamp
    const ids = await this.gun.get("agents").get(this.avatar.playerId).get("memories").get(timestamp).get("image", function(ack){
      console.log('ACK, remember', ack)
    })
    console.log('ids', ids)


  }

  async renderAvatarView() {
    console.log("RENDERING AVATAR VIEW")
    const position = this.avatar.position
    const rotation = this.avatar.rotation
    this.camera.position.set(position.x, position.y + 2, position.z) // faked height, will need to decapitate the avatar and get height in the future
    this.camera.rotation.set(rotation.x, rotation.y, rotation.z)
    this.camera.up = this.up
    this.renderer.render(this.engine.scene.scene, this.camera)
  }
}
