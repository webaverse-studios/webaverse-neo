import { agents } from "../gun-client.js";

export function addAgentToGunDB(agentID) {
  return agents.put(agentID)
}
