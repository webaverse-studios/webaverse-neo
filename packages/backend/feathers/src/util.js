import crypto from 'crypto'
/**
 *
 * @param condition
 */
export function generateHash( condition={})
{
  // create hash using json stringified condition object hash should be an integer
  const hash = crypto.createHash( 'md5' )
  hash.update( JSON.stringify( condition ))
  // return hash as integer
  return hash.digest( 'hex' )
}
