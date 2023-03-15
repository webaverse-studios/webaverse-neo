import { client } from '#Feathers'


/**
 * Adds a memory to the Feathers database.
 *
 * @function
 * @param {object} data - The data to be added to the Feathers database, generally in the format:
 *  `{
 *   hash_condition: {},
 *   file: Blob,
 *   metadata: {
 *   type: string,
 *   size: number,
 *   }
 * }`
 * @returns {Promise<object>} The response from the Feathers database service.
 * @async
 * @throws {Error} If the data is invalid.
 */
export async function addMemoryToFeathersDB( data ) {
  // add a memory to the feathers database
  return client.service( 'files' ).create( data )
}

/**
 * Retrieves a memory from the Feathers database.
 *
 * @function
 * @param {string} id The ID of the memory to retrieve from the Feathers database.
 * @returns {Promise<object>} The memory retrieved from the Feathers database.
 * @async
 */
export async function getMemoryFromFeathersDB( id ) {
  // get memories from the feathers database
  return client.service( 'files' ).get( id )
}
