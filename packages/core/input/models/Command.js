/** @typedef {import("@webaverse-studios/types").CommandCallback} CommandCallback */

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
    this.bindings = [...bindings]
    this.#callback = callback
  }

  /**
   * Command Bindings
   *
   * @type {string[]}
   */
  get bindings() {
    return this.#bindings
  }

  /**
   * Command Callback
   *
   * @type {CommandCallback}
   */
  get callback() {
    return this.#callback
  }

  /**
   * Set Command Bindings
   *
   * @param {string[]} bindings Command bindings
   */
  set bindings( bindings ) {
    this.#bindings = bindings
  }

  /**
   * Set Command Callback
   *
   * @param {CommandCallback} callback Command callback
   */
  set callback( callback ) {
    this.#callback = callback
  }
}

export { Command }
