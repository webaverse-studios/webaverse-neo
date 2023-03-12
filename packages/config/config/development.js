const { getNetworkConfig } = require( '../lib/getNetworkConfig.js' )


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


module.exports = {
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
