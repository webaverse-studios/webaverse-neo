const { createURL } = require( './createURL.js' )


/**
 * Get a network configuration object.
 *
 * @param {string} protocol The protocol.
 * @param {string} host The host.
 * @param {number} port The port.
 * @returns {object} The network configuration object.
 */
function getNetworkConfig( protocol, host, port ) {
  return {
    protocol,
    host,
    port,
    url: createURL( protocol, host, port ),
  }
}


module.exports = { getNetworkConfig }
