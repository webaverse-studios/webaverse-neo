import { createCommands } from '../lib/index'
import { defaultProfile } from '../profiles/index'
import { Command } from './Command'
import { Debug } from '@webaverse-studios/debug'

/** @typedef {import('../commands').Commands} Commands */
/** @typedef {import('@webaverse-studios/types').Profile} Profile */

/**
 * @class InputManager
 */
export class InputManager {
  /**
   * @type {Map<string, Command>}
   */
  #bindings = new Map()

  /**
   * @type {Map<string, (thisArg: Command, ...argArray: any[]) => void>}
   */
  #eventListeners = {}

  /**
   * @type {Commands}
   */
  #commands = null

  /**
   * @type {Profile}
   */
  #profile = null

  /**
   * InputManager Constructor
   *
   * @param {Profile} [profile=defaultProfile] The profile to use
   */
  constructor( profile = defaultProfile ) {
    this.profile = profile
  }

  /**
   * Handle Keyboard Input
   *
   * @param {KeyboardEvent} event The keyboard event to handle
   */
  #handleKeyboardInput( event ) {
    const binding = event.code
    const command = this.#bindings.get( binding )
    if ( command ) this.#triggerCommand( command, binding )
  }

  /**
   * Handle Mouse Input
   *
   * @param {MouseEvent} event The mouse event to handle
   */
  #handleMouseInput( event ) {
    const binding = `Mouse${event.button}`
    const command = this.#bindings.get( binding )
    if ( command ) this.#triggerCommand( command, binding )
  }

  #removeEventListeners( element ) {
    for ( const event in this.#eventListeners ) {
      element.removeEventListener( event, this.#eventListeners[event])
    }

    this.#eventListeners = {}
  }

  /**
   * Trigger a command's callback
   *
   * @param {Command} command The command to trigger
   * @param binding
   */
  #triggerCommand( command, binding ) {
    command?.callback( binding )
  }

  /**
   * Add event listeners to the element
   *
   * @param {HTMLElement} element The element to add event listeners to
   */
  addEventListeners( element ) {
    // Store events listeners so they can be removed later
    this.#eventListeners = {
      // keydown: this.handleInput.bind( this ),
      keyup: this.handleInput.bind( this ),
      mousedown: this.handleInput.bind( this ),
      // mouseup: this.handleInput.bind( this ),
    }

    for ( const event in this.#eventListeners ) {
      element.addEventListener( event, this.#eventListeners[event])
    }
  }

  /**
   * Destroy the input manager
   */
  destroy() {
    this.#removeEventListeners()
  }

  /**
   * Handle mouse and keyboard input
   *
   * @param {KeyboardEvent | MouseEvent} event The event to handle
   */
  handleInput( event ) {
    if ( event instanceof KeyboardEvent ) {
      this.#handleKeyboardInput( event )
    } else {
      this.#handleMouseInput( event )
    }
  }

  /**
   * Register commands.
   *
   * @param {Commands} commands The commands to register.
   * @returns {void}
   */
  registerCommands( commands ) {
    for ( const [, command] of commands ) {
      command.bindings.forEach(( binding ) => {
        this.#bindings.set( binding, command )
      })
    }
  }

  /**
   * Unregister commands.
   *
   * @param {Command} commands The commands to unregister.
   * @returns {void}
   */
  unregisterCommands( ...commands ) {
    for ( const [, command] of commands ) {
      command.bindings.forEach(( binding ) => {
        this.#bindings.delete( binding )
      })
    }
  }

  /**
   * Get the input profile
   *
   * @returns {Profile} The input profile
   */
  get profile() {
    return this.#profile
  }

  /**
   * Set the input profile
   *
   * @param {Profile} profile The input profile to set
   */
  set profile( profile ) {
    Debug.log( 'Setting profile', profile )
    this.#profile = profile
    this.#commands = createCommands( profile )
    this.#bindings.clear()
    this.registerCommands( this.#commands )
  }
}
