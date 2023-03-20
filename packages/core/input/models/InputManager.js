import { createCommands } from '../lib/index.js'
import { defaultProfile } from '../profiles/index.js'

/**
 * @class InputManager
 */
export class InputManager {
  #bindings = new Map()

  /**
   */
  #eventListeners = {}

  #commands = null

  #profile = null

  /**
   * Create an input manager
   *
   * @param {import('@webaverse-studios/types').Profile} profile The profile to register
   */
  constructor( profile = defaultProfile ) {
    this.profile = profile
  }

  get profile() {
    return this.#profile
  }

  set profile( profile ) {
    this.#profile = profile
    this.#commands = createCommands( profile )
    this.#bindings.clear()
    this.registerCommands( this.#commands )
  }

  /**
   *
   * @param {KeyboardEvent} event
   */
  #handleKeyboardInput( event ) {
    const command = this.#bindings.get( event.code )

    if ( command ) this.#triggerCommand( command, event )
  }

  /**
   *
   * @param {MouseEvent} event
   */
  #handleMouseInput( event ) {
    const command = this.#bindings.get( `Mouse${event.button}` )

    if ( command ) this.#triggerCommand( command )
  }

  #removeEventListeners( element ) {
    for ( const event in this.#eventListeners ) {
      element.removeEventListener( event, this.#eventListeners[event])
    }

    this.#eventListeners = {}
  }

  /**
   *
   * @param {Command} command
   * @param {KeyboardEvent | MouseEvent} event
   */
  #triggerCommand( command, event ) {
    command?.callback( event )
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
      // keyup: this.handleInput.bind( this ),
      mousedown: this.handleInput.bind( this ),
      // mouseup: this.handleInput.bind( this ),
    }

    for ( const event in this.#eventListeners ) {
      element.addEventListener( event, this.#eventListeners[event])
    }
  }

  destroy() {
    this.#removeEventListeners()
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
   * Register commands.
   *
   * @param commands The commands to register.
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
}
