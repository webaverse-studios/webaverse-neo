/**
 * @fileOverview Module for managing memories.
 * @module memory
 */

import {addMemoryToGunDB, getMemoriesFromGunDB} from "./gundb.js";
import {addMemoryToFeathersDB} from "./feathersdb.js";
import {getMemoryFromGunDB} from "./gundb.js";
import {getMemoryFromFeathersDB} from "./feathersdb.js";
import {transformation} from "./transformations.js";

/**
 * Async function that returns the original text with a 50% probability
 * or a transformed version with a 50% probability.
 * @param {string} text - The text to be remembered.
 * @returns {string} The original text or a transformed version.
 */
async function rememberText(text) {
  const coinFlip = Math.random() >= 0.5;
  if (coinFlip) {
    return text;
  } else {
    return transformation(text);
  }
}

/**
 * Async function that returns the original image with a 50% probability
 * or a transformed version with a 50% probability.
 * @param {string} image - The image to be remembered.
 * @returns {string} The original image or a transformed version.
 */
async function rememberImage(image) {
  const coinFlip = Math.random() >= 0.5;
  if (coinFlip) {
    return image;
  } else {
    return transformation(image);
  }
}

/**
 * Async function that returns the original audio with a 50% probability
 * or a transformed version with a 50% probability.
 * @param {string} audio - The audio to be remembered.
 * @returns {string} The original audio or a transformed version.
 */
async function rememberAudio(audio) {
  const coinFlip = Math.random() >= 0.5;
  if (coinFlip) {
    return audio;
  } else {
    return transformation(audio);
  }
}

/**
 * Async function that retrieves and returns memories associated with the given agent and timestamp.
 * For every memory modality, it performs their remember function (which can modify the memory).
 * @param {string} agent - The agent that created the memory.
 * @param {number} timestamp - The timestamp the memory was created.
 * @returns {object} An object containing the retrieved memories.
 */
export async function remember(agent, timestamp) {
  // get ids from the gun database and use them to access the feathers database
  // for every memory modality we perform their remember function (which can modify the memory)
  const memory = {};

  const {data} = await getMemoryFromGunDB(agent, timestamp);
  for (const key of Object.keys(data).slice(1)) {
    const id = data[key];
    const modality = await getMemoryFromFeathersDB(id);
    if (key === "text") {
      memory.text = await rememberText(modality);
    }
    if (key === "image") {
      memory.image = await rememberImage(modality);
    }
    if (key === "audio") {
      memory.audio = await rememberAudio(modality);
    }
  }
  return memory;
}

/**
 * Add a specific memory associated with an agent and timestamp to the databases. This function stores the memory data
 * in FeathersDB and the ids associated with the memory data in GunDB.
 *
 * @async
 * @function addMemory
 * @param {string} agent - The name of the agent associated with the memory.
 * @param {string} timestamp - The timestamp associated with the memory.
 * @param {Object} data - An object containing the memory data, with each type of memory (text, image, audio) being
 *                        represented by a property in the object.
 * @returns {Promise<void>}
 */
export async function addMemory(agent, timestamp, data) {
  // store data in feathers and store the ids in the gun database
  for (const key of Object.keys(data)) {
    const feathers_response = await addMemoryToFeathersDB(data[key]);
    const {id} = feathers_response;

    // add to gun
    await addMemoryToGunDB(agent, timestamp, {[key]: id});
  }
}

/**
 * Get the memory ids associated with a specific agent. This function retrieves the memory ids from GunDB and returns them.
 *
 * @async
 * @function getMemoryIDs
 * @param {string} agent - The name of the agent associated with the memories.
 * @returns {Promise<Array>} - An array containing the memory ids.
 */
export const getMemoryIDs = async (agent) => {
  return getMemoriesFromGunDB(agent);
}
