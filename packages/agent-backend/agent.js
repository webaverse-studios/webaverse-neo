

import * as THREE from "three";

import {addMemory, getMemoryIDs, remember} from "./memory/memory.js";
import {addAgentToGunDB} from "./gun-utils/agents-util.js";


export class Agent {
  // agent class that handles AI agents that can be given API access to a game server

  constructor({engine}) {
    this.engine = engine
    this.avatar = engine.avatar
    console.log('this.avatar: ', this.avatar)

    // feathers client


    // add agent to gun db
    console.log("addAGENT", addAgentToGunDB("this.avatar.playerId"))


    this.offscreenCanvas = new OffscreenCanvas(1024, 1024)
    this.renderer = new THREE.WebGLRenderer({canvas: this.offscreenCanvas})
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)


    const renderManager = async () => {
      await this.renderAvatarView()
    }

    const memorizeManager = async () => {
      this.timestamp = Date.now()
      const imageBlob = await this.offscreenCanvas.convertToBlob()
      const img_data = {
        hash_condition: {agentID: this.avatar.playerId, timestamp: this.timestamp},
        file: imageBlob,
        metadata: {
          type: imageBlob.type,
          size: imageBlob.size,
        }
      }

      const text_blob = new Blob(["this is a test"], {type: 'text/plain'})
      const text_data = {
        hash_condition: {agentID: this.avatar.playerId, timestamp: this.timestamp},
        file: text_blob,
        metadata: {
          type: text_blob.type,
          size: text_blob.size,
        }
      }
      await addMemory(this.avatar.playerId, this.timestamp, {image:img_data, text:text_data})
    }

    const rememberManager = async () => {
      console.log(await remember(this.avatar.playerId, this.timestamp))
    }

    const getAllMemories = async () => {
      console.log(await getMemoryIDs(this.avatar.playerId))
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
      if (event.key === 'Control') {
        console.log('Control')
        getAllMemories()
      }
    })
  }

  async memorize(timestamp, memory) {
    console.log('addMemoryToDB', timestamp, memory)
    // add a memory to the feathers (caching files) and then storing the hash in gun
    for (const key of Object.keys(memory)) {
      console.log('key', key, memory[key])
      const response = await this.feathers.service('files').create(memory[key])
      console.log('response', response, response.id)
      const gun_response = await this.gun.get("agents").get(this.avatar.playerId).get("memories").get(timestamp).get(key).put(response.id, function (ack) {
        console.log('ACK', ack)
      })
      console.log('gun_response', gun_response)
    }
  }

  async remember(timestamp) {
    // get the ids from the gun DB based on the timestamp
    const ids = await this.gun.get("agents").get(this.avatar.playerId).get("memories").get(timestamp).get("image", function (ack) {
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
