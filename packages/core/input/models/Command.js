/**
 * Callback executed when a command is triggered.
 *
 * @callback CommandCallback
 * @param {object} [params] Callback params
 */

class Command {
  name

  /** @type {string[]} */
  #bindings = []

  /** @type {CommandCallback} */
  #callback = null

  /**
   * Command Class
   *
   * @param {string} symbol Command symbol
   * @param {string[]} bindings Command bindings
   * @param {CommandCallback} callback Command callback
   */
  constructor( symbol, bindings, callback = () => {}) {
    this.name = symbol.description
    this.bindings = [ ...bindings ]
    this.#callback = callback
  }

  get bindings() {
    return this.#bindings
  }

  get callback() {
    return this.#callback
  }

  set bindings( bindings ) {
    this.#bindings = bindings
  }

  set callback( callback ) {
    this.#callback = callback
  }
}

export { Command }
