import http from 'http'

import config from '@webaverse-studios/config'


const { port } = config.gunConfig


// Create a new HTTP server.
export const server = http.createServer().listen( port )
