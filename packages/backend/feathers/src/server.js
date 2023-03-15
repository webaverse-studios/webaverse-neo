import { logger } from './logger.js'

import { app } from '#App'

const port = app.get( 'port' )
const host = app.get( 'host' )


export const server = await app.listen( port )


logger.info( `Feathers app listening on http://${host}:${port}` )
