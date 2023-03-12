import {agents} from "../../gun.js";

/**
 * Add an agent to gun.
 *
 * @param agentID The agent ID.
 */
export function addAgentToGunDB( agentID ) {
  return agents.put( agentID )
}
