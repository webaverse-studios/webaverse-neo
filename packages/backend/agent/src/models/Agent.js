/**
 * @file agent.js
 * @brief Contains the Agent class, which handles AI agents that can be given API access to a game server.
 */

import * as THREE from 'three'
import m from 'mithril'
import { apikey } from '../index.js'

const basePrompt = {
  role: 'system',
  content: `You are playing a survival game called Upstreet. You die when either when your Water or Food reach 0/10. In this game, you are given an Observed State that describes your current situation. You need to make a Plan of possible actions and follow it by performing an Action. After every action, you wait for the user to send you a new Observed state and you update your plan and perform a new action. Your task is to provide a plan of action and an action to take based on the user's observed state.
  The possible actions are described in the Observed State under Actions = [option1, option2].
  The conversation should follow the structure:
  \`\`\`
   User Input -> Observed State: ...
   Assistant reply -> Plan: ...
                      Action: ...

   \`\`\`

  Here's an example conversation structure that you can use as a guide:

  Example Conversation:
  \`\`\`
  User: Observed State: Position = {"x":0,"y":0,"z":0}, Rotation = {"isEuler":true,"_x":0,"_y":3.141592653589793,"_z":0,"_order":"XYZ"}, Actions = ["move","rotate"], Water 4/10, Food 10/10, Items = ["bottle":{"state":["empty"],"actions":["fill"]}], Surrounding = {}
  Assistant: Plan: I should: 1. Look for water. 2. Go to water. 3. Fill bottle. 4. Drink water.
  Action: agent rotate -degrees 360

  User: Observed State: Position = {"x":0,"y":0,"z":0}, Rotation = {"isEuler":true,"_x":0,"_y":3.141592653589793,"_z":0,"_order":"XYZ"}, Actions = ["move","rotate"], Water 4/10, Food 10/10, Items = ["bottle":{"state":["empty"],"actions":["fill"]}], Surrounding = {"lake":{"position":{"x":10,"y":0,"z":0},"actions":[]},"well":{"position":{"x":20,"y":0,"z":10}}
  Assistant: Plan: 1. Go to water. 2. Fill bottle. 3. Drink water.
  Action: agent move -position 10,0,0

  User: Observed State: Position = {"x":10,"y":0,"z":0}, Rotation = {"isEuler":true,"_x":0,"_y":3.141592653589793,"_z":0,"_order":"XYZ"}, Actions = ["move","rotate","use"], Water 3/10, Food 10/10, Items = ["bottle":{"state":["empty"],"actions":["fill"]}], Surrounding = {"lake":{"position":{"x":10,"y":0,"z":0},"actions":[]},"well":{"position":{"x":20,"y":0,"z":10}}
  Assistant: Plan: 1. Fill bottle. 2. Drink water.
  Action: agent use bottle fill

  User: Observed State: Position = {"x":10,"y":0,"z":0}, Rotation = {"isEuler":true,"_x":0,"_y":3.141592653589793,"_z":0,"_order":"XYZ"}, Actions = ["move","rotate","use"], Water 3/10, Food 10/10, Items = ["bottle": {"state":["full"],"actions":["drink"]}], Surrounding = {"lake":{"position":{"x":10,"y":0,"z":0},"actions":[]},"well":{"position":{"x":20,"y":0,"z":10}}
  Assistant: Plan: 1. Drink water.
  Action: agent use bottle drink

  User: Observed State: Position = {"x":10,"y":0,"z":0}, Rotation = {"isEuler":true,"_x":0,"_y":3.141592653589793,"_z":0,"_order":"XYZ"}, Actions = ["move","rotate","use"], Water 10/10, Food 10/10, Items = ["bottle": {"state":["full"],"actions":["drink"]}], Surrounding = {"lake":{"position":{"x":10,"y":0,"z":0},"actions":[]},"well":{"position":{"x":20,"y":0,"z":10}}
  Assistant: Plan: [Done]
  Action: [Done]
  \`\`\`

  Keep in mind to form the Action in this structure and stay strict with this : Action: agent <action> <args> without any period or spaces between commas
  If you can use an item it follows this structure and stay strict with this: 'Action: agent use <item> <action>' without any period or spaces between commas
  You are only able to specify one action at a time, so you have to wait for the next observed state to be given before you can perform another action.
  The actions available for an item are defined in the "Items" section of the Observed State in the "actions":[action1, action2] format.
  Always remember that you can only use the actions that are available in the Observed State, defined in the "Actions = [option1, option2]" section!!!
  You die when either when your Water or Food reach 0/10 and any action will reduce subtract from the value putting you closer to death!
  `,
}
const endpoint = 'https://api.openai.com/v1/chat/completions'

import { emotional_states } from './config.js'
import { img2img } from '../lib/emotional-vision/img2img.js'
import { describe } from '../lib/emotional-vision/img2text'
import { addAgentToGunDB } from '../lib/gun/addAgentToGunDB.js'
import { addMemory, getMemoryIDs, remember } from '../lib/memories/index.js'

/**
 * @class Agent
 * @brief Handles AI agents that can be given API access to a game server.
 */
export class Agent {
  /**
   * @param engine The engine instance for the game server.
   * @param canvas The canvas element to render the agentView to.
   * @brief Constructor for the Agent class.
   */
  constructor({ engine, canvas }) {
    this.engine = engine
    this.canvas = canvas
    console.log('engine', engine)
    this.avatar = engine.scene.character
    console.log('avatar', this.avatar)
    addAgentToGunDB(this.avatar.playerId)

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const position = this.avatar.position
    const rotation = this.avatar.rotation
    this.camera.position.set(position.x, position.y + 3, position.z)
    this.camera.rotation.set(rotation.x, rotation.y, rotation.z)

    // set random emotional state and strength
    const states = Object.keys(emotional_states)
    this.setEmotionalState(states[Math.floor(Math.random() * states.length)])
    this.setEmotionalStrength(Math.random())
    this.surrounding = []
    this.items = {}
    this.hunger = 10
    this.thirst = 10
    this.actions = ['move', 'rotate']
    this.plan = ''
    this.command = ''

    // example of how to use the memory functions
    const renderManager = async () => {
      await this.renderAvatarView()
    }

    const memorizeManager = async () => {
      this.timestamp = Date.now()
      const imageBlob = await new Promise((resolve) => {
        this.canvas.toBlob(resolve)
      })
      const { editedImage, description } =
        await this.applyEmotionalStateToImage(imageBlob)

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

    const checkSurroundings = () => {
      this.performAction(this.engine.scene._scene)
    }

    addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        console.log('rendering')
        renderManager()
      }

      if (event.key === '/') {
        console.log('check surroundings')
        checkSurroundings()
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

    this.renderAvatarView()
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

  updateActions() {
    // based on the surrounding objects, update the actions that the agent can take, e.g. if there is an object that is close enough to pick up, add the pick-up action
    // check if any objects in 1m radius
    this.actions = ['move', 'rotate']
    console.log('Surrounding: ', this.surrounding, this.actions)
    for (let i = 0; i < this.surrounding.length; i++) {
      if (
        this.surrounding[i].position.distanceTo(this.avatar.position) < 1 &&
        this.surrounding[i].userData?.scene_actions
      ) {
        this.actions.push('use')
      }
    }
    // iterate over the this.items object and extract possible actions
    for (const key in this.items) {
      if (this.items[key].userData?.item_actions) {
        this.actions.push('use')
      }
    }
  }

  observedState() {
    const position = this.avatar.position
    const rotation = this.avatar.rotation
    const surrounding = {}
    for (let i = 0; i < this.surrounding.length; i++) {
      surrounding[this.surrounding[i].name] = {
        position: this.surrounding[i].position,
        state: this.surrounding[i].userData.state ?? [],
        actions: this.surrounding[i].userData.scene_actions ?? [],
      }
    }
    console.log(surrounding)
    const items = {}
    for (const key in this.items) {
      items[key] = {
        state: this.items[key].userData.state ?? [],
        actions: this.items[key].userData.item_actions,
      }
    }
    console.log('ITEMS', JSON.stringify(items))

    return `Observed State: Position = ${JSON.stringify(
      position
    )}, Rotation = ${JSON.stringify(rotation)}, Water ${
      this.thirst
    }/10, Food ${this.hunger}/10, Items = ${JSON.stringify(
      items
    )}, Actions = ${JSON.stringify(
      this.actions
    )}, Surrounding = ${JSON.stringify(surrounding)}`
  }

  async performAction(scene) {
    await this.checkSurrounding(scene)
    this.updateActions()
    const observedState = this.observedState()
    console.log('OSBERVED', observedState)
    const { message } = await callGPT([
      {
        role: 'user',
        content: observedState,
      },
    ])
    console.log('OUT', message)
    this.compileCommand(message.content)
    await this.checkSurrounding(scene)
    this.updateActions()
    this.renderAvatarView()
    m.redraw()
  }

  async checkSurrounding(scene) {
    // add all objects visible to the camera to this.surrounding with the objects name, position, and timestamp of when it was seen
    this.camera.updateMatrixWorld()
    const cameraViewProjectionMatrix = new THREE.Matrix4()
    cameraViewProjectionMatrix.multiplyMatrices(
      this.camera.projectionMatrix,
      this.camera.matrixWorldInverse
    )

    const frustum = new THREE.Frustum()
    // set the frustum from the camera's view projection matrix
    frustum.setFromProjectionMatrix(cameraViewProjectionMatrix)
    console.log('SCENE TO CHECK = ', this.engine.scene._scene)
    this.surrounding = [] // TODO better filtering so it doesn't forget objects immediatlly
    for (const object of scene.children) {
      if (object.type === 'Group' || object.type === 'Object3D') {
        var box = new THREE.Box3().setFromObject(object)
        const sphere = new THREE.Sphere()
        box.getBoundingSphere(sphere)
        if (
          frustum.intersectsSphere(sphere) ||
          sphere.distanceToPoint(this.avatar.position) < 1
        ) {
          // add the object to the surrounding and break out of traverse
          this.surrounding.push(object)
        }
      }
    }
    console.log('Surrounding', this.surrounding)
  }

  compileCommand(message) {
    // Split text at position 'Action: '
    const split = message.split('Action: ')
    // Get the action from the second part of the split
    const action = split[1]
    console.log('action: ', action)
    const parts = action.split(' ')
    const command = parts[1]
    this.plan = split[0]
    this.command = action
    if (command === 'move') {
      const movementType = parts[2]
      if (movementType === '-position') {
        const position = parts[3]
        const positionParts = position.split(',')
        const x = positionParts[0]
        const y = positionParts[1]
        const z = positionParts[2]
        console.log('move to position', x, y, z)
        this.avatar.position.set(x, y, z)
        this.avatar.avatar.scene.position.set(x, y, z)
        this.thirst -= 1
        this.hunger -= 1
        m.redraw()
      }
    } else if (command === 'pick-up') {
      const objectName = parts[2]
      const object = this.surrounding.find((o) => o.name === objectName)
      if (object && object.userData.scene_actions.includes('pick-up')) {
        // replace pick-up action with drop action
        object.userData.item_actions.push('drop')
        // check if object.name is already in this.items and if so add a number to the end of the name
        let name = object.name
        let counter = 1
        while (name in this.items) {
          name = object.name + counter
          counter++
        }
        this.items[name] = object
        console.log('updated items = ', this.items)
        // remove object from this.engine.scene._scene
        this.engine.scene._scene.remove(object)
        console.log('Picked up object', objectName)
        console.log('updated scene = ', this.engine.scene._scene)
      }
    } else if (command === 'use') {
      console.log('USE', command)
      const objectName = parts[2]
      console.log(objectName, this.items, this.surrounding)
      if (objectName in this.items) {
        console.log('USING ITEM')
        const object = this.items[objectName]
        console.log('object', object, objectName)
        if (object && object.userData.item_actions) {
          const action = parts[3]
          if (object.userData.item_actions.includes(action)) {
            if (action === 'drink') {
              console.log('drank water')
              this.thirst = 10
              // remove object from this.items by objectName
              delete this.items[objectName]
            } else if (action === 'eat') {
              this.hunger = 10
            }
          }
        }
      } else if (this.surrounding.find((o) => o.name === objectName)) {
        const action = parts[3]
        const object = this.surrounding.find((o) => o.name === objectName)
        console.log('USING SURROUNDING', action, object)
        if (object.userData.scene_actions) {
          if (action === 'pick-up') {
            console.log('PICKING UP', object.userData.scene_actions)
            if (
              object.userData.scene_actions.includes('pick-up') &&
              object.position.distanceTo(this.avatar.position) < 1
            ) {
              // replace pick-up action with drop action
              object.userData.item_actions.push('drop')
              // check if object.name is already in this.items and if so add a number to the end of the name
              let name = object.name
              let counter = 1
              while (name in this.items) {
                name = object.name + counter
                counter++
              }
              this.items[name] = object
              console.log('updated items = ', this.items)
              // remove object from this.engine.scene._scene
              this.engine.scene._scene.remove(object)
              console.log('Picked up object', objectName)
              console.log('updated scene = ', this.engine.scene._scene)
            }
          }
        }
      }
      console.log('Done Using')
    }
  }
}

/**
 *
 * @param blob
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
 * @param base64String
 * @param mimeType
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

/**
 *
 * @param messages
 */
async function callGPT(messages) {
  const response = await fetch(`${endpoint}`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apikey}`,
      },

      body: JSON.stringify({
        // TODO: Prune messages to fit within the token limit without
        //  dropping the system message.
        messages: [
          basePrompt,
          ...messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        ],
        model: 'gpt-3.5-turbo',
      }),
    }),
    json = await response.json(),
    message = json.choices?.[0]?.message

  console.log('message:', json)

  return { message }
}
