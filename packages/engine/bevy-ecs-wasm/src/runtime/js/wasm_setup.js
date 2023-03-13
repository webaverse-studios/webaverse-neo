/**
 * This file is used to setup the global variables that are used by the WASM
 *
 * @param bevyModJsScripting
 * @param op_name_map_str
 */
export function setup_js_globals( bevyModJsScripting, op_name_map_str ) {
  const op_name_map = JSON.parse( op_name_map_str )

  // Set the bevy scripting op function to Deno's opSync function
  window.bevyModJsScriptingOpSync = ( op_name, ...args ) => {
    try {
      return bevyModJsScripting.op_sync( op_name_map[op_name], args )
    } catch ( e ) {
      throw `Error during \`${op_name}\`: ${e}`
    }
  }
}
