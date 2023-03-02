import { gun } from '#Gun'

/**
 * @typedef {import('#JSDoc').User} User
 */

/**
 * Promisified gun.user().auth()
 *
 * @param {string} username The username with which to authenticate.
 * @param {string} password The password with which to authenticate.
 * @returns {Promise<User>|object} Resolves to authenticated user or
 * rejects with error.
 */
export async function auth( username, password ) {
  return new Promise(( resolve, reject ) => {
    gun.user()
      .auth( username, password, ack =>
        ack.err
          ? reject( ack.err )
          : resolve( ack.sea )
      )
  })
}
