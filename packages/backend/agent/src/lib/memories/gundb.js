import {agents} from "../../gun.js";

/**
 * Adds a memory to the GunDB database for the specified agent and timestamp.
 * The data should be the hash/id for the Feathers database entry.
 *
 * @function
 * @async
 * @param {string} agent - The agent identifier.
 * @param {string} timestamp - The timestamp for the memory.
 * @param {Object} data - The data to be added to the database, in the format of {memory-type: id}. Memory types are text, image, and audio.
 * @returns {Promise<Object>} - The memory data from GunDB.
 * @throws {Error} - If the data parameter is invalid.
 */
export async function addMemoryToGunDB(agent, timestamp, data) {
  if (typeof data === "object" && data !== null) {
    agents.get(agent).get("memories").get(timestamp).put(data);
    return getMemoryFromGunDB(agent, timestamp);
  } else {
    console.log("Invalid data:", data);
    throw new Error("Invalid data");
  }
}

/**
 * Gets the memory data for the specified agent and timestamp from the GunDB database.
 *
 * @function
 * @async
 * @param {string} agent - The agent identifier.
 * @param {string} timestamp - The timestamp for the memory.
 * @returns {Promise<Object>} - The memory data from GunDB.
 */
export async function getMemoryFromGunDB(agent, timestamp) {
  return agents.get(agent).get("memories").get(timestamp).promOnce();
}

/**
 * Gets all the memory data for the specified agent from the GunDB database.
 *
 * @function
 * @async
 * @param {string} agent - The agent identifier.
 * @returns {Promise<Object>} - All the memory data from GunDB.
 */
export async function getMemoriesFromGunDB(agent) {
  return agents.get(agent).get("memories").promOnce();
}
