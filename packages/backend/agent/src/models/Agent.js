/**
 * @file agent.js
 * @brief Contains the Agent class, which handles AI agents that can be given API access to a game server.
 */

import * as THREE from 'three'

import { addMemory, getMemoryIDs, remember } from '../lib/memories/index.js'
import { addAgentToGunDB } from '../lib/gun/addAgentToGunDB.js'

/**
 * @class Agent
 * @brief Handles AI agents that can be given API access to a game server.
 */
export class Agent {
  /**
   * @brief Constructor for the Agent class.
   * @param engine.engine
   * @param engine The engine instance for the game server.
   */
  constructor({ engine }) {
    console.log('ENGINE:', engine)
    this.engine = engine
    this.avatar = engine.scene.character
    addAgentToGunDB(this.avatar.playerId)

    this.offscreenCanvas = new OffscreenCanvas(1024, 1024)
    this.renderer = new THREE.WebGLRenderer({ canvas: this.offscreenCanvas })
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)

    // example of how to use the memory functions
    const renderManager = async () => {
      await this.renderAvatarView()
    }

    const memorizeManager = async () => {
      this.timestamp = Date.now()
      const imageBlob = await this.offscreenCanvas.convertToBlob()
      const img_data = {
        hash_condition: {
          agentID: this.avatar.playerId,
          timestamp: this.timestamp,
        },
        file: imageBlob,
        metadata: {
          type: imageBlob.type,
          size: imageBlob.size,
        },
      }

      const text_blob = new Blob(['this is a test'], { type: 'text/plain' })
      const text_data = {
        hash_condition: {
          agentID: this.avatar.playerId,
          timestamp: this.timestamp,
        },
        file: text_blob,
        metadata: {
          type: text_blob.type,
          size: text_blob.size,
        },
      }
      await addMemory(this.avatar.playerId, this.timestamp, {
        image: img_data,
        text: text_data,
      })
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
      if (event.key === 'Enter') {
        renderManager()
      }
      if (event.key === ' ') {
        memorizeManager()
      }

      if (event.key === 'Shift') {
        rememberManager()
      }

      if (event.key === 'Backspace') {
        clearRenderer()
      }
      if (event.key === 'Control') {
        getAllMemories()
      }
    })
  }

  /**
   * @brief Renders the avatar view for the Agent.
   */
  async renderAvatarView() {
    const position = this.avatar.position
    const rotation = this.avatar.rotation
    this.camera.position.set(position.x, position.y + 2, position.z) // faked height, will need to decapitate the avatar and get height in the future
    this.camera.rotation.set(rotation.x, rotation.y, rotation.z)
    this.camera.up = this.up
    this.renderer.render(this.engine.scene._scene, this.camera)
  }
}
