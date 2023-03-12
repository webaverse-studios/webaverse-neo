/**
 * Callback for adding two numbers.
 *
 * @callback CommandCallback
 * @param {object} [params] Callback params
 */

class Command {
  name

  /** @type {string[]} */
  triggers = []

  /** @type {CommandCallback} */
  callback = null

  /**
   * Command Class
   *
   * @param {string} name Command name
   * @param {string[]} triggers Command triggers
   * @param {CommandCallback} callback Command callback
   */
  constructor( name, triggers, callback = () => {}) {
    this.name = name
    this.triggers = triggers
    this.callback = callback
    console.log( callback )
  }
}

export { Command }
