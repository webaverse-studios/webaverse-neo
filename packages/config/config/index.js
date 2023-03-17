const defaultConfig = require( './default.js' )
const development = require( './development.js' )
const { merge } = require( 'lodash' )


const
  mode =
    // ( typeof process !== 'undefined' && process.env.NODE_ENV )
    // || import.meta?.env?.MODE
    process.env.NODE_ENV
    || 'production',

  configs = { development },
  envConfig = configs[ mode ] || {}


const config = new Map(
  Object.entries( merge( defaultConfig, envConfig ))
)


module.exports = { config }
