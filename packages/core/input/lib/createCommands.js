import { Command } from '../models/index.js'


/**
 * Create a command map from a profile.
 *
 * @param profile
 */
export function createCommands(profile ) {
  console.log('profile', profile)
  return profile.reduce(( acc, params ) => {
    acc.set( params[0], new Command( ...params ))
    return acc
  }, new Map())
}
