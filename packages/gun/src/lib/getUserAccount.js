import { gun } from '#Gun'


export async function getUserAccount( username ) {
  return await gun.get( `~@${username}` ).once().then()
}
