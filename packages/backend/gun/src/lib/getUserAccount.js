import { gun } from '#Gun'


/**
 *
 * @param username
 */
export async function getUserAccount( username ) {
  return await gun.get( `~@${username}` ).once().then()
}
