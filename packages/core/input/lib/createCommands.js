import { Command } from '../models/index'

/**
 * Create a command map from a profile.
 *
 * @param {Profile} profile The profile to create commands from
 * @returns {Map<string, Command>} The command map
 */
export function createCommands( profile ) {
  console.log( 'profile', profile )
  return profile.reduce(( acc, params ) => {
    acc.set( params[0], new Command( ...params ))
    return acc
  }, new Map())
}
