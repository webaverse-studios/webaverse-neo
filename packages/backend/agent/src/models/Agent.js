/**
 * @file agent.js
 * @brief Contains the Agent class, which handles AI agents that can be given API access to a game server.
 */

import * as THREE from 'three'

import { addMemory, getMemoryIDs, remember } from '../lib/memories/index.js'
import { addAgentToGunDB } from '../lib/gun/addAgentToGunDB.js'

import { describe } from '../lib/emotional-vision/img2text'
import { img2img } from '../lib/emotional-vision/img2img.js'
import { emotional_states } from './config.js'
import { computeVisualSentiment } from '../lib/visual-sentiment-analysis/visual-sentiment.js'

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
    this.engine = engine
    this.avatar = engine.scene.character
    addAgentToGunDB(this.avatar.playerId)

    this.offscreenCanvas = new OffscreenCanvas(512, 512)
    this.renderer = new THREE.WebGLRenderer({ canvas: this.offscreenCanvas })
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)

    // set random emotional state and strength
    const states = Object.keys(emotional_states)
    this.setEmotionalState(states[Math.floor(Math.random() * states.length)])
    this.setEmotionalStrength(Math.random())

    // example of how to use the memory functions
    const renderManager = async () => {
      await this.renderAvatarView()
    }

    const memorizeManager = async () => {
      this.timestamp = Date.now()
      const imageBlob = await this.offscreenCanvas.convertToBlob()
      const { editedImage, description } =
        await this.applyEmotionalStateToImage(imageBlob)

      const sentiment = await computeVisualSentiment(editedImage)
      console.log('sentiment', sentiment)

      const img_data = {
        hash_condition: {
          agentID: this.avatar.playerId,
          timestamp: this.timestamp,
        },
        file: editedImage,
        metadata: {
          type: editedImage.type,
          size: editedImage.size,
        },
      }

      const text_blob = new Blob(
        [
          'Prompt: ' +
            this.prefix +
            description +
            ' || Negative prompt: ' +
            this.suffix +
            ' || Emotional State: ' +
            this.emotional_state +
            ' || Emotional Strength: ' +
            this.emotional_strength,
        ],
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
    // faked height, will need to decapitate the avatar and get height in the future
    this.camera.position.set(position.x, position.y + 2, position.z)
    this.camera.rotation.set(rotation.x, rotation.y, rotation.z)
    this.camera.up = this.up
    this.renderer.render(this.engine.scene._scene, this.camera)
  }

  async applyEmotionalStateToImage(imgBlob) {
    const b64str = await BlobToString(imgBlob)
    const description = await describe(b64str)

    const prompt = this.prefix + description
    const neg_prompt = this.suffix
    const img2img_result = await img2img({
      init_images: [b64str],
      prompt: prompt,
      negative_prompt: neg_prompt,
      denoising_strength: this.emotional_strength,
      alwayson_scripts: {
        controlnet: {
          args: [
            {
              input_image: b64str,
              module: 'canny',
              model: 'control_canny-fp16 [e3fe7712]',
            },
          ],
        },
      },
    })

    return {
      editedImage: await base64ToBlobWithOffscreenCanvas(
        img2img_result[0],
        'image/png'
      ),
      description: description,
    }
  }

  setEmotionalState(key) {
    if (key in emotional_states) {
      this.emotional_state = key
      this.prefix = emotional_states[this.emotional_state][0]
      this.suffix = emotional_states[this.emotional_state][1]
    }
  }

  setEmotionalStrength(strength) {
    this.emotional_strength = strength
  }
}

/**
 *
 */
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

/**
 *
 */
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
