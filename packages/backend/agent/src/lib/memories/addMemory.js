import {addMemoryToFeathersDB} from './feathersdb.js'
import {addMemoryToGunDB} from './gundb.js'

/**
 * Add a specific memory associated with an agent and timestamp to the
 * databases. This function stores the memory data in FeathersDB and
 * the ids associated with the memory data in GunDB.
 *
 * @function addMemory
 * @param {string} agent The name of the agent associated with the memory.
 * @param {string} timestamp The timestamp associated with the memory.
 * @param {object} data - An object containing the memory data, with each
 * type of memory (text, image, audio) being represented by a property in the
 * object.
 * @returns {Promise<void>}
 * @async
 */
export async function addMemory( agent, timestamp, data ) {
  // store data in feathers and store the ids in the gun database
  for ( const key of Object.keys( data )) {
    const feathers_response = await addMemoryToFeathersDB( data[key])
    const {id} = feathers_response

    // add to gun
    await addMemoryToGunDB( agent, timestamp, {[key]: id})
  }
}
