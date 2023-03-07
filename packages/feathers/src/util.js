import crypto from 'crypto'
export function generateHash(condition={})
{
  // create hash using json stringified condition object hash should be an integer
  const hash = crypto.createHash('md5');
  hash.update(JSON.stringify(condition));
  // return hash as integer
  return parseInt(hash.digest('hex'), 16)
}
