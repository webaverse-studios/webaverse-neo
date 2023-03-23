/**
 * Parse a JSON string, returning null if it fails.
 *
 * @param {string} jsonString the JSON string
 * @returns {any | Error} the parsed JSON
 */
export function parseJson( jsonString ) {
  try {
    return JSON.parse( jsonString )
  } catch ( err ) {
    return err
  }
}
