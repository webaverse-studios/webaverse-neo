import fs from 'fs'

/**
 * Try to read a file, return null if it doesn't exist.
 *
 * @param {fs.PathOrFileDescriptor} filePath Path to file
 * @returns {Buffer | undefined} File contents or null
 */
export const tryReadFile = ( filePath ) => {
  try {
    return fs.readFileSync( filePath )
  } catch ( err ) {
    return undefined
  }
}
