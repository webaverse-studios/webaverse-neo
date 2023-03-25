/**
 * @file agent.js
 * @brief Contains the Agent class, which handles AI agents that can be given API access to a game server.
 */

import * as THREE from 'three'
import m from 'mithril'
import { apikey, gpt_model } from '../index.js'

const basePrompt = {
  role: 'system',
  content: `You are playing a survival game called Upstreet. You die when either when your Water or Food reach 0/10. In this game, you are given an Observed State that describes your current situation. You need to make a Plan of possible actions and follow it by performing an Action. After every action, you wait for the user to send you a new Observed state and you update your plan and perform a new action. Your task is to provide a plan of action and an action to take based on the user's observed state.
  The possible actions are described in the Observed State under Actions = {option1:command style, option2:command style}.
  The conversation should follow the structure:
  \`\`\`
   User Input -> Observed State: ...
   Assistant reply -> Plan: ...
                      Action: ...

   \`\`\`

  Here's an example conversation structure that you can use as a guide:

  Example Conversation:
  \`\`\`
  User: Observed State: Position = {"x":0,"y":0,"z":0}, Rotation = {"isEuler":true,"_x":0,"_y":3.141592653589793,"_z":0,"_order":"XYZ"},  Actions = {"move":{format:"agent move -position <x,y,z>"},"rotate":{format:"agent rotate -degrees <d>"},"use":{"format":"agent use <item> <action> <params>"}}, Water 4/10, Food 10/10, Items = {"bottle":{"actions":{"fill":{format:"<action> = drink <params> = target", condition:"user.distanceTo(target)<1 && state.includes("empty")"},"drink":{format:"<action> = drink <params> = ''", condition:"state.includes("full")}, state:["empty"]}}, Surrounding = {}
  Assistant: Plan: I should: 1. Look for water. 2. Go to water. 3. Fill bottle. 4. Drink water.
  Action: agent rotate -degrees 360

  User: Observed State: Position = {"x":0,"y":0,"z":0}, Rotation = {"isEuler":true,"_x":0,"_y":3.141592653589793,"_z":0,"_order":"XYZ"},  Actions = {"move":{format:"agent move -position <x,y,z>"},"rotate":{format:"agent rotate -degrees <d>"},"use":{"format":"agent use <item> <action> <params>"}}, Water 4/10, Food 10/10, Items ={"bottle":{"actions":{"fill":{format:"<action> = drink <params> = target", condition:"user.distanceTo(target)<1 && state.includes("empty")"},"drink":{format:"<action> = drink <params> = ''", condition:"state.includes("full")}, state:["empty"]}}, Surrounding = {"lake":{"position":{"x":10,"y":0,"z":0},"actions":{}},"well":{"position":{"x":20,"y":0,"z":10}}}
  Assistant: Plan: 1. Go to water. 2. Fill bottle. 3. Drink water.
  Action: agent move -position 10,0,0

  User: Observed State: Position = {"x":10,"y":0,"z":0}, Rotation = {"isEuler":true,"_x":0,"_y":3.141592653589793,"_z":0,"_order":"XYZ"}, Actions = {"move":{format:"agent move -position <x,y,z>"},"rotate":{format:"agent rotate -degrees <d>"},"use":{"format":"agent use <item> <action> <params>"}}, Water 3/10, Food 10/10, Items = {"bottle":{"actions":{"fill":{format:"<action> = drink <params> = target", condition:"user.distanceTo(target)<1 && state.includes("empty")"},"drink":{format:"<action> = drink <params> = ''", condition:"state.includes("full")}, state:["empty"]}}, Surrounding = {"lake":{"position":{"x":10,"y":0,"z":0},"actions":{}},"well":{"position":{"x":20,"y":0,"z":10},"actions":{}}}
  Assistant: Plan: 1. Fill bottle. 2. Drink water.
  Action: agent use bottle fill lake

  User: Observed State: Position = {"x":10,"y":0,"z":0}, Rotation = {"isEuler":true,"_x":0,"_y":3.141592653589793,"_z":0,"_order":"XYZ"},  Actions = {"move":{format:"agent move -position <x,y,z>"},"rotate":{format:"agent rotate -degrees <d>"},"use":{"format":"agent use <item> <action> <params>"}}, Water 3/10, Food 10/10, Items = {"bottle":{"actions":{"fill":{format:"<action> = drink <params> = target", condition:"user.distanceTo(target)<1 && state.includes("empty")"},"drink":{format:"<action> = drink <params> = ''", condition:"state.includes("full")}, state:["empty"]}}, Surrounding = {"lake":{"position":{"x":10,"y":0,"z":0},"actions":{}}},"well":{"position":{"x":20,"y":0,"z":10},"actions":{}}}
  Assistant: Plan: 1. Drink water.
  Action: agent use bottle drink

  User: Observed State: Position = {"x":10,"y":0,"z":0}, Rotation = {"isEuler":true,"_x":0,"_y":3.141592653589793,"_z":0,"_order":"XYZ"},  Actions = {"move":{format:"agent move -position <x,y,z>"},"rotate":{format:"agent rotate -degrees <d>"},"use":{"format":"agent use <item> <action> <params>"}}, Water 10/10, Food 10/10, Items = {"bottle":{"actions":{"fill":{format:"<action> = drink <params> = target", condition:"user.distanceTo(target)<1 && state.includes("empty")"},"drink":{format:"<action> = drink <params> = ''", condition:"state.includes("full")}, state:["empty"]}}, Surrounding = {"lake":{"position":{"x":10,"y":0,"z":0},"actions":{}},"well":{"position":{"x":20,"y":0,"z":10},"actions":{}}}
  ...
  \`\`\`

  Keep in mind to form the Action in the structure defined by the action and stay strict with the format, e.g. "use":{"format":"agent use <item> <action> <params>"} --> agent use bottle fill lake
  You are only able to specify one action at a time, so you have to wait for the next observed state to be given before you can perform another action.
  The actions available for an item are defined in the "Items" section of the Observed State in the "actions":{action1:command format, action2: command format} format! Only stick to the actions that are available for the item!
  Always remember that you can only use the actions that are available in the Observed State, defined in the "Actions = {action1:command format, action2: command format}" section!!!
  If an action does not resolve you get penalized by the game!
  You die when either when your Water or Food reach 0/10 and any action will reduce subtract from the value putting you closer to death!
  `,
}
const endpoint = 'https://api.openai.com/v1/chat/completions'

import { emotional_states } from './config.js'
import { img2img } from '../lib/emotional-vision/img2img.js'
import { describe } from '../lib/emotional-vision/img2text'
import { addAgentToGunDB } from '../lib/gun/addAgentToGunDB.js'
import { addMemory, getMemoryIDs, remember } from '../lib/memories/index.js'
import { Deque } from '../lib/util.js'

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
    this.surrounding = new Set()
    this.items = {}
    this.hunger = 10
    this.thirst = 10
    this.actions = {
      move: `agent move -position <x,y,z>`,
      rotate: `agent rotate -degrees <d>`,
    }
    this.plan = ''
    this.command = ''
    this.memory = new Deque(100)

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
    // based on the surrounding objects, update the actions that the agent can take, e.g. if there is an object that is close enough to pick-up, add the pick-up action
    // check if any objects in 1m radius
    console.log('Surrounding: ', this.surrounding, this.actions)
    for (const object of this.surrounding) {
      if (
        object.position.distanceTo(this.avatar.position) < 1 &&
        object.userData?.scene_actions
      ) {
        this.actions['use'] = `agent use <item> <action> <params>`
      }
    }
    // iterate over the this.items object and extract possible actions
    for (const key in this.items) {
      if (this.items[key].userData?.item_actions) {
        this.actions['use'] = `agent use <item> <action> <params>`
      }
    }
  }

  observedState() {
    const position = this.avatar.position
    const rotation = this.avatar.rotation
    const surrounding = {}
    for (const object of this.surrounding) {
      surrounding[object.name] = {
        position: object.position,
        state: object.userData.state ?? [],
        actions: object.userData.scene_actions ?? [],
      }
    }
    console.log('SURROUNDINGused', surrounding, this.surrounding)
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

    if (this.memory.toArray().length > 30) {
      const { message } = await summarizeGPT(this.memory.toArray())
      console.log('Summerize', message)
      const memory_backup = []
      if (message !== undefined) {
        memory_backup.push(message)
      }
      memory_backup.push(...this.memory.toArray().slice(-5))
      console.log('MEMORY Backup', memory_backup)
      this.memory = new Deque(100)
      this.memory.items = memory_backup
    }

    this.memory.push({
      role: 'user',
      content: observedState,
    })

    const { message } = await callGPT(this.memory.toArray())
    console.log('OUT', message)
    if (message !== undefined) {
      this.memory.push(message)
      await this.compileCommand(message.content)
    }
    console.log('MEMORY', this.memory)
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
    // this.surrounding = new Set() // TODO better filtering so it doesn't forget objects immediatlly
    for (const object of scene.children) {
      if (object.type === 'Group' || object.type === 'Object3D') {
        var box = new THREE.Box3().setFromObject(object)
        const sphere = new THREE.Sphere()
        box.getBoundingSphere(sphere)
        if (frustum.intersectsSphere(sphere)) {
          // add the object to the surrounding and break out of traverse
          this.surrounding.add(object)
        }
      }
    }
    console.log('Surrounding', this.surrounding)
  }

  async compileCommand(message) {
    let resolved = false
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
        resolved = true
      }
    } else if (command === 'rotate') {
      const rotationType = parts[2]
      if (rotationType === '-degrees') {
        let startRotation = this.avatar.rotation.y
        const degrees = parts[3]
        console.log('current rotation', startRotation)
        console.log(
          'rotate by degrees',
          degrees,
          THREE.MathUtils.degToRad(degrees)
        )
        while (
          this.avatar.avatar.scene.rotation.y - startRotation <
          THREE.MathUtils.degToRad(degrees)
        ) {
          console.log(
            'current rotation',
            startRotation,
            this.avatar.avatar.scene.rotation.y,
            this.avatar.avatar.scene.rotation.y - startRotation,
            THREE.MathUtils.degToRad(degrees)
          )
          if (degrees > this.avatar.avatar.scene.rotation.y) {
            console.log('rotate right')
            this.avatar.rotation.y += 0.01
            this.avatar.avatar.scene.rotation.y += 0.01
            this.renderAvatarView()
            this.checkSurrounding(this.engine.scene._scene)
            m.redraw()
            setTimeout(() => {}, 1000)
          } else {
            console.log('rotate left')
            this.avatar.rotation.y -= 0.01
            this.avatar.avatar.scene.rotation.y -= 0.01
            this.renderAvatarView()
            this.checkSurrounding(this.engine.scene._scene)
            m.redraw()
            setTimeout(() => {}, 1000)
          }
          await new Promise((resolve) => setTimeout(resolve, 5))
        }
        this.thirst -= 0.5
        this.hunger -= 0.5
        resolved = true
      }
    } else if (command === 'pick-up') {
      const objectName = parts[2]
      const object = [...this.surrounding.values()].find(
        (o) => o.name === objectName
      )

      if (object && object.userData.scene_actions['pick-up']) {
        // replace pick-up action with drop action
        object.userData.item_actions['drop'] = {
          format: `<action> = drop <params> = ''`,
        }
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
        resolved = true
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
          console.log('Trying to perform action', action)
          if (object.userData.item_actions[action]) {
            if (action === 'drink') {
              console.log('drank water')
              this.thirst = 10
              resolved = true
              // remove object from this.items by objectName
              delete this.items[objectName]
            } else if (action === 'eat') {
              this.hunger = 10
              resolved = true
            } else if (action === 'equip') {
              console.log(
                'equipping',
                this.items[objectName].userData.item_actions
              )
              delete this.items[objectName].userData.item_actions['equip']
              this.items[objectName].userData.item_actions['unequip'] = {
                format: `<action> = unequip <params> = ''`,
              }
              this.items[objectName].userData.item_actions['attack'] = {
                format: `<action> = attack <params> = target`,
                condition: `target.distanceTo(user) < 1`,
              }
              resolved = true
            } else if (action === 'unequip') {
              delete this.items[objectName].userData.item_actions['unequip']
              delete this.items[objectName].userData.item_actions['attack']
              this.items[objectName].userData.item_actions['equip'] = {
                format: `<action> = equip <params> = ''`,
              }
              resolved = true
            } else if (action === 'attack') {
              console.log('Trying to attack')
              const targetName = parts[4]
              console.log('Trying to attack', targetName)
              const target = [...this.surrounding.values()].find(
                (o) => o.name === targetName
              )
              if (target) {
                console.log('ATTACKING', target)
                this.hunger = 10
                this.surrounding.delete(target)
                this.engine.scene._scene.remove(target)
                resolved = true
              }
            }
          }
        }
      } else if (
        [...this.surrounding.values()].find((o) => o.name === objectName)
      ) {
        const action = parts[3]
        const object = [...this.surrounding.values()].find(
          (o) => o.name === objectName
        )
        console.log('USING SURROUNDING', action, object)
        if (object.userData.scene_actions) {
          if (action === 'talk') {
            if (object.userData.scene_actions['talk']) {
              console.log('TALKING')
              this.hunger = 10
              resolved = true
            }
          }
          if (action === 'pick-up') {
            console.log('PICKING UP', object.userData.scene_actions)
            if (
              object.userData.scene_actions['pick-up'] &&
              object.position.distanceTo(this.avatar.position) < 1
            ) {
              // replace pick-up action with drop action
              object.userData.item_actions[
                'drop'
              ] = `<action> = drop <params> = ''`
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
              this.surrounding.delete(object)
              console.log('Picked up object', objectName)
              console.log('updated scene = ', this.engine.scene._scene)
              resolved = true
            }
          }
        }
      }
      console.log('Done Using')
    }

    if (resolved === false) {
      console.log('Action not resolved', action)
      this.memory.push({
        role: 'system',
        content:
          'You tried to ' +
          action +
          " but it didn't work. The game penalizes you for trying to do something that doesn't work.",
      })
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
async function summarizeGPT(messages) {
  let message
  console.log('messages:', messages)
  let summaryPrompt = {
    role: 'system',
    content:
      'You play a video game call "Upstreet". You will be given the last interactions you had in the , by the user. Summarize them in a way that the context will help you follow the same structure in responses, while keeping important game information intact. You are allowed to fill 4000 tokens from the GPT tokenizer.',
  }
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
          summaryPrompt,
          { role: 'user', content: JSON.stringify(messages) },
        ],
        model: gpt_model,
      }),
    }),
    json = await response.json()
  message = json.choices?.[0]?.message

  console.log('message:', json)

  return { message }
}

async function callGPT(messages) {
  let message
  console.log('messages:', messages)
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
        model: gpt_model,
      }),
    }),
    json = await response.json()
  message = json.choices?.[0]?.message

  console.log('message:', json)
  // while (message === undefined) {
  //   // wait 0.5 seconds and try again
  //   await new Promise((r) => setTimeout(r, 2000))
  //   console.log('messages:', messages)
  //   const response = await fetch(`${endpoint}`, {
  //       method: 'POST',
  //
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${apikey}`,
  //       },
  //
  //       body: JSON.stringify({
  //         // TODO: Prune messages to fit within the token limit without
  //         //  dropping the system message.
  //         messages: [
  //           basePrompt,
  //           ...messages.map((message) => ({
  //             role: message.role,
  //             content: message.content,
  //           })),
  //         ],
  //         model: gpt_model,
  //       }),
  //     }),
  //     json = await response.json()
  //   message = json.choices?.[0]?.message
  //
  //   console.log('message:', json)
  // }

  return { message }
}
