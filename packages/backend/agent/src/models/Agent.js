/**
 * @file agent.js
 * @brief Contains the Agent class, which handles AI agents that can be given API access to a game server.
 */

import * as THREE from 'three'
import fs from 'fs'

import { addMemory, getMemoryIDs, remember } from '../lib/memories/index.js'
import { addAgentToGunDB } from '../lib/gun/addAgentToGunDB.js'

import { describe } from '../lib/emotional-vision/img2text'
import { img2img } from '../lib/emotional-vision/img2img.js'

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

    this.offscreenCanvas = new OffscreenCanvas(512, 512)
    this.renderer = new THREE.WebGLRenderer({ canvas: this.offscreenCanvas })
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)

    this.happy_prefix = '((Bright)), ((Happy)), ((Joyful)), '
    this.angry_prefix = '((Dark)), ((Angry)), ((Wrath)), ((Hate)), '
    this.sad_prefix = '((Dark)), ((Sad)), ((Lonely)), ((Depressed)), '
    this.nervous_prefix = '((Dark)), ((Nervous)), ((Anxious)), ((Stressed)), '
    this.excited_prefix = '((Bright)), ((Excited)), ((Energetic)), ((Happy)), '
    this.calm_prefix = '((Bright)), ((Calm)), ((Peaceful)), ((Relaxed)), '
    this.tired_prefix =
      '((Dark)), ((Tired)), ((Sleepy)), ((Relaxed)), ((Hazy)), '

    // example of how to use the memory functions
    const renderManager = async () => {
      await this.renderAvatarView()
    }

    const memorizeManager = async () => {
      this.timestamp = Date.now()
      const imageBlob = await this.offscreenCanvas.convertToBlob()

      const b64str = await BlobToString(imageBlob)
      console.log('b64str', b64str)
      const description = await describe(b64str)
      console.log('Description', description)

      const prompt = this.sad_prefix + description
      const neg_prompt = this.happy_prefix
      const img2img_result = await img2img({
        init_images: [b64str],
        prompt: prompt,
        negative_prompt: neg_prompt,
        denoising_strength: 0.5,
      })
      console.log('img2img_result', img2img_result)

      const imageBlob2 = await base64ToBlobWithOffscreenCanvas(
        img2img_result[0],
        'image/png'
      )
      console.log('imageBlob2', imageBlob2)

      const img_data = {
        hash_condition: {
          agentID: this.avatar.playerId,
          timestamp: this.timestamp,
        },
        file: imageBlob2,
        metadata: {
          type: imageBlob2.type,
          size: imageBlob2.size,
        },
      }

      const text_blob = new Blob(
        ['Prompt: ' + prompt + ' || Negative prompt: ' + neg_prompt],
        { type: 'text/plain' }
      )
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
        text: text_data,
        image: img_data,
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
        console.log('rendering')
        renderManager()
      }
      if (event.key === ' ') {
        console.log('memorizing')
        memorizeManager()
      }

      if (event.key === 'Shift') {
        console.log('remembering')
        rememberManager()
      }

      if (event.key === 'Backspace') {
        console.log('clearing')
        clearRenderer()
      }
      if (event.key === 'Control') {
        console.log('getting all memories')
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

function BlobToString(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = () => {
      const base64data = reader.result.replace(/^data:.+;base64,/, '')
      resolve(base64data)
    }
    reader.onerror = reject
  })
}

function base64ToBlob(base64String, mimeType) {
  return new Promise((resolve, reject) => {
    const binaryString = atob(base64String)
    const blob = new Blob([binaryString], {
      type: mimeType || 'application/octet-stream',
    })
    resolve(blob)
  })
}

async function base64ToBlobWithOffscreenCanvas(base64String, mimeType) {
  const offscreenCanvas = new OffscreenCanvas(1, 1)
  const context = offscreenCanvas.getContext('2d')

  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      offscreenCanvas.width = image.width
      offscreenCanvas.height = image.height
      context.drawImage(image, 0, 0)

      offscreenCanvas
        .convertToBlob({ type: mimeType || 'image/png' })
        .then((blob) => {
          resolve(blob)
        })
        .catch((error) => {
          reject(error)
        })
    }
    image.onerror = (error) => {
      reject(error)
    }
    image.src = `data:${mimeType || 'image/png'};base64,${base64String}`
  })
}
