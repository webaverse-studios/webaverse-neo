import { logger } from './logger.js'

// Handle promise rejections.
process.on( 'unhandledRejection', ( reason, p ) => logger.error( 'Unhandled Rejection at: Promise ', p, reason ))
