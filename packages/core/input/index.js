import { COMMANDS } from './command-constants.js'
import { Command } from './command.js'

import pull from 'lodash.pull'
import clonedeep from 'lodash.clonedeep'

/**
 * @class InputManager
 */
class InputManager {
  /**
   * @type {Command[]}
   */
  #commands = []

  /**
   */
  #eventListeners = {}

  /**
   * @param {Command[]} commands
   */
  constructor( commands = COMMANDS ) {
    console.log( COMMANDS )
    this.#commands = commands
  }

  /**
   *
   * @param {KeyboardEvent} event
   */
  #handleKeyboardInput( event ) {
    const trigger = event.code

    for ( const commandKey in this.#commands ) {
      /** @type {Command} */
      const command = this.#commands[commandKey]
      if ( command.triggers.includes( trigger )) {
        this.#triggerCommand( command )
      }
    }
  }

  /**
   *
   * @param {MouseEvent} event
   */
  #handleMouseInput( event ) {
    const trigger = `Mouse${event.button}`

    for ( const commandKey in this.#commands ) {
      /** @type {Command} */
      const command = this.#commands[commandKey]
      if ( command.triggers.includes( trigger )) {
        this.#triggerCommand( command )
      }
    }
  }

  /**
   *
   * @param {Command} command
   */
  #triggerCommand( command ) {
    console.log( `Event fired: ${command.name}` )
    console.log( command )
    command?.callback()
  }

  /**
   *
   * @param {KeyboardEvent | MouseEvent} event
   */
  handleInput( event ) {
    if ( event instanceof KeyboardEvent ) {
      this.#handleKeyboardInput( event )
    } else {
      this.#handleMouseInput( event )
    }
  }

  /**
   * Add event listeners to the element
   *
   * @param {HTMLElement} element The element to add event listeners to
   */
  addEventListeners( element ) {
    // Store events listeners so they can be removed later
    this.#eventListeners = {
      keydown: this.handleInput.bind( this ),
      keyup: this.handleInput.bind( this ),
      mousedown: this.handleInput.bind( this ),
      mouseup: this.handleInput.bind( this ),
    }

    for ( const event in this.#eventListeners ) {
      element.addEventListener( event, this.#eventListeners[event])
    }
  }

  #removeEventListeners( element ) {
    for ( const event in this.#eventListeners ) {
      element.removeEventListener( event, this.#eventListeners[event])
    }

    this.#eventListeners = {}
  }

  destroy() {
    this.#removeEventListeners()
  }
}

export { InputManager }

/**
 * Things to do:
 * - add / remove commands
 *
 */
