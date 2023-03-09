import {feathersClient} from "../feathers-client.js";

export async function addMemoryToFeathersDB(data) {
  // add a memory to the feathers database
  return feathersClient.service("files").create(data);
}

export async function getMemoryFromFeathersDB(id) {
  // get memories from the feathers database
  return feathersClient.service("files").get(id);
}
