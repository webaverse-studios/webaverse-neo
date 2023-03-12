import {createURL} from '../lib/index.js'


const
  feathersHost = 'localhost',
  feathersPort = 3402,
  feathersProtocol = 'http',

  gunHost = 'localhost',
  gunPort = 3401,
  gunProtocol = 'http',
  gunNetworkConfig = getNetworkConfig( gunProtocol, gunHost, gunPort ),

  upstreetHost = 'localhost',
  upstreetPort = 3400,
  upstreetProtocol = 'http'

gunNetworkConfig.url += '/gun'

export default {
  feathers: {
    ...getNetworkConfig( feathersProtocol, feathersHost, feathersPort ),
  },

  gun: {
    ...gunNetworkConfig,
    peers: [ gunNetworkConfig.url ],
  },

  upstreet: {
    ...getNetworkConfig( upstreetProtocol, upstreetHost, upstreetPort ),
  }
}


/**
 * Get a network configuration object.
 *
 * @param {string} protocol The protocol.
 * @param {string} host The host.
 * @param {number} port The port.
 * @returns {object} The network configuration object.
 */
export function getNetworkConfig( protocol, host, port ) {
  return {
    protocol,
    host,
    port,
    url: createURL( protocol, host, port ),
  }
}
