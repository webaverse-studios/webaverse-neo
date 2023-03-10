import {feathersClient} from "../feathers-client.js";

/**
 * Adds a memory to the Feathers database.
 *
 * @function
 * @async
 * @param {Object} data - The data to be added to the Feathers database, generally in the format:
 *  `{
 *   hash_condition: {},
 *   file: Blob,
 *   metadata: {
 *   type: string,
 *   size: number,
 *   }
 * }`
 * @returns {Promise<Object>} The response from the Feathers database service.
 * @throws {Error} If the data is invalid.
 */
export async function addMemoryToFeathersDB(data) {
  // add a memory to the feathers database
  return feathersClient.service("files").create(data);
}

/**
 * Retrieves a memory from the Feathers database.
 *
 * @function
 * @async
 * @param {string} id - The ID of the memory to retrieve from the Feathers database.
 * @returns {Promise<Object>} The memory retrieved from the Feathers database.
 */
export async function getMemoryFromFeathersDB(id) {
  // get memories from the feathers database
  return feathersClient.service("files").get(id);
}
