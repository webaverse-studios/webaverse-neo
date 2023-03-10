import { Callback, HandleEventCallback } from '@webaverse-studios/types'

/**
 * Abstract base class that implements functionality for event handling.
 *
 * ```javascript
 * var obj = new EventHandlerSubclass();
 *
 * // subscribe to an event
 * obj.on('hello', function (str) {
 *     console.log('event hello is fired', str);
 * });
 *
 * // fire event
 * obj.fire('hello', 'world');
 * ```
 */
export class EventHandler {
  /**
   * @type {Callback}
   */
  #callbacks = {}

  /**
   * @type {Callback}
   */
  #callbackActive = {}

  /**
   * Reinitialize the event handler.
   */
  initEventHandler() {
    this.#callbacks = {}
    this.#callbackActive = {}
  }

  /**
   * Registers a new event handler.
   *
   * @param {string} name Name of the event to bind the callback to.
   * @param {HandleEventCallback} callback - Function that is called when event
   * is fired. Note the callback is limited to 8 arguments.
   * @param {object} [scope] - Object to use as 'this' when the event is fired,
   * defaults to current this.
   * @param {boolean} [once=false] - If true, the callback will be unbound after
   * being fired once.
   * @private
   */
  _addCallback( name, callback, scope, once = false ) {
    if ( !name || typeof name !== 'string' || !callback ) return

    if ( !this.#callbacks[name]) this.#callbacks[name] = []

    if (
      this.#callbackActive[name] &&
      this.#callbackActive[name] === this.#callbacks[name]
    )
      this.#callbackActive[name] = this.#callbackActive[name].slice()

    this.#callbacks[name].push({
      callback: callback,
      scope: scope || this,
      once: once,
    })
  }

  /**
   * Attach an event handler to an event.
   *
   * @param {string} name Name of the event to bind the callback to.
   * @param {HandleEventCallback} callback Function that is called when event is
   * fired. Note the callback is limited to 8 arguments.
   * @param {object} [scope] - Object to use as 'this' when the event is fired,
   * defaults to current this.
   * @returns {EventHandler} Self for chaining.
   * @example
   * obj.on('test', function (a, b) {
   *     console.log(a + b);
   * });
   * obj.fire('test', 1, 2); // prints 3 to the console
   */
  on( name, callback, scope ) {
    this._addCallback( name, callback, scope, false )
    return this
  }

  /**
   * Detach an event handler from an event. If callback is not provided then all
   * callbacks are unbound from the event, if scope is not provided then all events
   * with the callback will be unbound.
   *
   * @param {string} [name] Name of the event to unbind.
   * @param {HandleEventCallback} [callback] Function to be unbound.
   * @param {object} [scope] Scope that was used as the this when the event is fired.
   * @returns {EventHandler} Self for chaining.
   * @example
   * var handler = function () {
   * };
   * obj.on('test', handler);
   *
   * obj.off(); // Removes all events
   * obj.off('test'); // Removes all events called 'test'
   * obj.off('test', handler); // Removes all handler functions, called 'test'
   * obj.off('test', handler, this); // Removes all handler functions,
   * called 'test' with scope this
   */
  off( name, callback, scope ) {
    if ( name ) {
      if (
        this.#callbackActive[name] &&
        this.#callbackActive[name] === this.#callbacks[name]
      )
        this.#callbackActive[name] = this.#callbackActive[name].slice()
    } else {
      for ( const key in this.#callbackActive ) {
        if ( !this.#callbacks[key]) continue

        if ( this.#callbacks[key] !== this.#callbackActive[key]) continue

        this.#callbackActive[key] = this.#callbackActive[key].slice()
      }
    }

    if ( !name ) {
      this.#callbacks = {}
    } else if ( !callback ) {
      if ( this.#callbacks[name]) this.#callbacks[name] = []
    } else {
      const events = this.#callbacks[name]
      if ( !events ) return this

      let count = events.length

      for ( let i = 0; i < count; i++ ) {
        if ( events[i].callback !== callback ) continue

        if ( scope && events[i].scope !== scope ) continue

        events[i--] = events[--count]
      }
      events.length = count
    }

    return this
  }

  /**
   * Fire an event, all additional arguments are passed on to the event listener.
   *
   * @param {string} name Name of event to fire.
   * @param {*} [arg1] First argument that is passed to the event handler.
   * @param {*} [arg2] Second argument that is passed to the event handler.
   * @param {*} [arg3] Third argument that is passed to the event handler.
   * @param {*} [arg4] Fourth argument that is passed to the event handler.
   * @param {*} [arg5] Fifth argument that is passed to the event handler.
   * @param {*} [arg6] Sixth argument that is passed to the event handler.
   * @param {*} [arg7] Seventh argument that is passed to the event handler.
   * @param {*} [arg8] Eighth argument that is passed to the event handler.
   * @returns {EventHandler} Self for chaining.
   * @example
   * obj.fire('test', 'This is the message');
   */
  fire( name, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8 ) {
    if ( !name || !this.#callbacks[name]) return this

    let callbacks

    if ( !this.#callbackActive[name]) {
      this.#callbackActive[name] = this.#callbacks[name]
    } else {
      if ( this.#callbackActive[name] === this.#callbacks[name])
        this.#callbackActive[name] = this.#callbackActive[name].slice()

      callbacks = this.#callbacks[name].slice()
    }

    // TODO: What does callbacks do here?
    // In particular this condition check looks wrong: (i < (callbacks || this.#callbackActive[name]).length)
    // Because callbacks is not an integer
    // eslint-disable-next-line no-unmodified-loop-condition
    for (
      let i = 0;
      ( callbacks || this.#callbackActive[name]) &&
      i < ( callbacks || this.#callbackActive[name]).length;
      i++
    ) {
      const evt = ( callbacks || this.#callbackActive[name])[i]
      evt.callback.call( evt.scope, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8 )

      if ( evt.once ) {
        // check that callback still exists because user may have unsubscribed
        // in the event handler
        const existingCallback = this.#callbacks[name]
        const ind = existingCallback ? existingCallback.indexOf( evt ) : -1

        if ( ind !== -1 ) {
          if ( this.#callbackActive[name] === existingCallback )
            this.#callbackActive[name] = this.#callbackActive[name].slice()

          this.#callbacks[name].splice( ind, 1 )
        }
      }
    }

    if ( !callbacks ) this.#callbackActive[name] = null

    return this
  }

  /**
   * Attach an event handler to an event. This handler will be removed after being
   * fired once.
   *
   * @param {string} name Name of the event to bind the callback to.
   * @param {HandleEventCallback} callback Function that is called when event
   * is fired. Note the callback is limited to 8 arguments.
   * @param {object} [scope] Object to use as 'this' when the event is fired,
   * defaults to current this.
   * @returns {EventHandler} Self for chaining.
   * @example
   * obj.once('test', function (a, b) {
   *     console.log(a + b);
   * });
   * obj.fire('test', 1, 2); // prints 3 to the console
   * obj.fire('test', 1, 2); // not going to get handled
   */
  once( name, callback, scope ) {
    this._addCallback( name, callback, scope, true )
    return this
  }

  /**
   * Test if there are any handlers bound to an event name.
   *
   * @param {string} name The name of the event to test.
   * @returns {boolean} True if the object has handlers bound to the specified
   * event name.
   * @example
   * obj.on('test', function () { }); // bind an event to 'test'
   * obj.hasEvent('test'); // returns true
   * obj.hasEvent('hello'); // returns false
   */
  hasEvent( name ) {
    return ( this.#callbacks[name] && this.#callbacks[name].length !== 0 ) || false
  }
}
