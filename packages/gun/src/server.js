import http from 'http'


const { PORT } = process.env


// Create a new HTTP server.
export const server = http.createServer().listen( PORT )
