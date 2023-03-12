import { getMemoriesFromGunDB } from './gundb.js'

/**
 * Get the memory ids associated with a specific agent.
 *
 * @async
 * @function getMemoryIDs
 * @param {string} agent - The name of the agent associated with the memories.
 * @returns {Promise<Array>} - An array containing the memory ids.
 */
export const getMemoryIDs = async ( agent ) => {
  return getMemoriesFromGunDB( agent )
}
