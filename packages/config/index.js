const { config } = require( './config/index.js' )


module.exports = {
  feathersConfig: config.get( 'feathers' ),
  gunConfig: config.get( 'gun' ),
  upstreetConfig: config.get( 'upstreet' ),
}
