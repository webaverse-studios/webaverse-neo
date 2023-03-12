import defaultConfig from './default.js'
import development from './development.js'


const
  mode =
    // ( typeof process !== 'undefined' && process.env.NODE_ENV )
    // || import.meta?.env?.MODE
    process.env.NODE_ENV
    || 'production',

  configs = {
    development,
  },

  envConfig = configs[ mode ] || {}


export const config = new Map(
  Object.entries({
    ...defaultConfig,
    ...envConfig,
  })
)
