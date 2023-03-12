

/**
 * Get a stream from a URL
 *
 * @param {string} url The URL to fetch.
 * @returns {ReadableStream} The stream.
 */
export function getStreamFromURL( url ) {
  return fetch( url ).then( r => r.body )
}
