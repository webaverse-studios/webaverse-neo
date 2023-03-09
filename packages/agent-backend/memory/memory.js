import {addMemoryToGunDB, getMemoriesFromGunDB} from "./gundb.js";
import { addMemoryToFeathersDB } from "./feathersdb.js";
import { getMemoryFromGunDB } from "./gundb.js";
import { getMemoryFromFeathersDB } from "./feathersdb.js";
import {transformation} from "./transformations.js";


async function rememberText(text){
  const coinFlip = Math.random() >= 0.5;
  if (coinFlip) {
    return text;
  } else {
    return transformation(text);
  }
}

async function rememberImage(image){
  const coinFlip = Math.random() >= 0.5;
  if (coinFlip) {
    return image;
  } else {
    return transformation(image);
  }
}

async function rememberAudio(audio){
  // flip coin to decide if we return the audio or perform a transformation
  const coinFlip = Math.random() >= 0.5;
  if (coinFlip) {
    return audio;
  } else {
    return transformation(audio);
  }
}

export async function remember(agent, timestamp) {
  // get ids from the gun database and use them to access the feathers database
  // for every memory modality we perform their remember function (which can modify the memory)
  const memory = {};

  const { data } = await getMemoryFromGunDB(agent, timestamp);
  for ( const key of Object.keys(data).slice(1) ) {
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

export async function addMemory(agent, timestamp, data) {
  // store data in feathers and store the ids in the gun database
  for (const key of Object.keys(data)) {
    const feathers_response = await addMemoryToFeathersDB(data[key]);
    console.log("FEATHERS RESPONSE:", feathers_response);
    const { id } = feathers_response;

    // add to gun
    await addMemoryToGunDB(agent, timestamp, { [key]: id });
  }
}

export const getMemoryIDs = async (agent) => {
  return getMemoriesFromGunDB(agent);
}
