import config from '@webaverse-studios/config'
import http from 'http'


const { port } = config.gunConfig


// Create a new HTTP server.
export const server = http.createServer().listen( port )
