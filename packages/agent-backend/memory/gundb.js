import {agents} from "../gun-client.js";

export async function addMemoryToGunDB(agent, timestamp, data) {
  // add a memory to the gun database data should be the hash/ id for the feathers database entry
  if (typeof data === "object" && data !== null) {
    agents.get(agent).get("memories").get(timestamp).put(data);
    return getMemoryFromGunDB(agent, timestamp);
  } else {
    console.log("Invalid data:", data);
    throw new Error("Invalid data");
  }
}

export async function getMemoryFromGunDB(agent, timestamp) {
  // get memories from the gun database
  return agents.get(agent).get("memories").get(timestamp).promOnce();
}

export async function getMemoriesFromGunDB(agent) {
  // get memories from the gun database
  return agents.get(agent).get("memories").promOnce();
}
