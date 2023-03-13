import { Command } from '../models/index.js'


/**
 * Create an input map from a profile.
 *
 * @param profile
 */
export function createInputMap( profile ) {
  console.log('profile', profile)
  return profile.reduce(( acc, params ) => {
    acc.set( params[0], new Command( ...params ))
    return acc
  }, new Map())
}
