/**
 * Construct a URL from a protocol, host, and port.
 *
 * @param {string} protocol The protocol.
 * @param {string} host The host.
 * @param {number} port The port.
 * @returns {string} The URL.
 */
function createURL( protocol, host, port ) {
  return `${protocol}://${host}:${port}`
}


module.exports = { createURL }
