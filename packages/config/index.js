const { config } = require( './config/index.js' )

module.exports = {
  gunConfig: config.get( 'gun' ),
  feathersConfig: config.get( 'feathers' ),
  upstreetConfig: config.get( 'upstreet' ),
}
