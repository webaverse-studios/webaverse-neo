import { Command } from './command.js'

/**
 * Create commands from array
 *
 * @param {[string, string, Function]} array Command params
 * @param {string} array[0] Command name
 * @param {string[]} array[1] Command triggers
 * @param {Function} array[2] Command callback
 * @returns {Object<string, Command>}
 */
// function createCommands( array ) {
//   return array.reduce(
//     ( acc, params ) => (
//       {
//         ...acc,
//         [params[0]]: new Command( ...params ),
//       },
//       {}
//     )
//   )
// }

// export const COMMANDS = createCommands([
//   ['jump', [' '], () => {console.log('jump')}],
//   ['look', ['c'], () => { console.log('look') }],
// ])

export const DEFAULT_COMMAND_BINDINGS = {
  look: ['KeyC'],
  jump: ['Space', 'Mouse0'],
  moveUp: ['KeyW', 'ArrowUp'],
  moveDown: ['KeyS', 'ArrowDown'],
  moveLeft: ['KeyA', 'ArrowLeft'],
  moveRight: ['KeyD', 'ArrowRight'],
}

export const COMMANDS = {
  jump: new Command( 'jump', DEFAULT_COMMAND_BINDINGS.jump, () => {
    console.log( 'jump' )
  }),
  look: new Command( 'look', DEFAULT_COMMAND_BINDINGS.look, () => {
    console.log( 'look' )
  }),
}

console.log( COMMANDS )
