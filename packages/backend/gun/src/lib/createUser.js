import { gun } from '#Gun'
import { auth } from './auth.js'


/**
 * @typedef {import('#JSDoc').User} User
 */

/**
 * Promisified gun.user().create()
 *
 * @param {string} username The username with which to authenticate.
 * @param {string} password The password with which to authenticate.
 * @returns {Promise<User>|object} Resolves to authenticated user or
 * rejects with error.
 */
export async function createUser( username, password ) {
  return await new Promise(( resolve, reject ) => {
    gun.user().create( username, password, ack =>
      ack.err
        ? reject( ack.err )
        // Return authenticated user.
        : resolve( auth( username, password ))
    )
  })
}
