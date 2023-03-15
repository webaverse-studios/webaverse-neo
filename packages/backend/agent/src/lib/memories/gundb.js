import {agents} from '../../gun.js'

/**
 * Adds a memory to the GunDB database for the specified agent and timestamp.
 * The data should be the hash/id for the Feathers database entry.
 *
 * @function
 * @param {string} agent The agent identifier.
 * @param {string} timestamp The timestamp for the memory.
 * @param {object} data The data to be added to the database, in the format of {memory-type: id}. Memory types are text, image, and audio.
 * @returns {Promise<object>} - The memory data from GunDB.
 * @async
 * @throws {Error} - If the data parameter is invalid.
 */
export async function addMemoryToGunDB( agent, timestamp, data ) {
  if ( typeof data === 'object' && data !== null ) {
    agents.get( agent ).get( 'memories' ).get( timestamp ).put( data )
    return getMemoryFromGunDB( agent, timestamp )
  } else {
    console.log( 'Invalid data:', data )
    throw new Error( 'Invalid data' )
  }
}

/**
 * Gets the memory data for the specified agent and timestamp from the GunDB database.
 *
 * @function
 * @param {string} agent The agent identifier.
 * @param {string} timestamp The timestamp for the memory.
 * @returns {Promise<object>} - The memory data from GunDB.
 * @async
 */
export async function getMemoryFromGunDB( agent, timestamp ) {
  return agents.get( agent ).get( 'memories' ).get( timestamp ).promOnce()
}

/**
 * Gets all the memory data for the specified agent from the GunDB database.
 *
 * @function
 * @param {string} agent The agent identifier.
 * @returns {Promise<object>} - All the memory data from GunDB.
 * @async
 */
export async function getMemoriesFromGunDB( agent ) {
  return agents.get( agent ).get( 'memories' ).promOnce()
}
