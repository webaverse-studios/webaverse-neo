import { createInputMap } from '../lib/index.js'
import { defaultProfile } from '../profiles/index.js'

/**
 * @class InputManager
 */
export class InputManager {
  #bindings = new Map()

  /**
   */
  #eventListeners = {}

  #map = createInputMap( defaultProfile )

  #profile = defaultProfile

  /**
   * @param {Command[]} commands
   */
  constructor({
    profile,
  } = {}) {
    if ( profile )
      this.profile = profile

    console.log( 'InputManager', this.#map )
    this.registerCommands( this.#map )
  }

  /**
   *
   * @param {KeyboardEvent} event
   */
  #handleKeyboardInput( event ) {
    const command = this.#bindings.get( event.code )

    if ( command )
      this.#triggerCommand( command )
  }

  /**
   *
   * @param {MouseEvent} event
   */
  #handleMouseInput( event ) {
    const command = this.#bindings.get( `Mouse${event.button}` )

    if ( command )
      this.#triggerCommand( command )
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
   */
  #triggerCommand( command ) {
    command?.callback()
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
    for ( const [ ,command ] of commands ) {
      command.bindings.forEach( binding => {
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
    for ( const [ ,command ] of commands ) {
      command.bindings.forEach( binding => {
        this.#bindings.delete( binding )
      })
    }
  }

  get profile() {
    return this.#profile
  }

  set profile( profile ) {
    this.#profile = profile
    this.#map = createInputMap( profile )
  }
}
