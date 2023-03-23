import fs from 'fs'
import http from 'http'
import https from 'https'

import express from 'express'

import { handler } from './api/handler.js'
import { SERVER_CERTS, SERVER_NAME, SERVER_PORT } from './lib/index.js'

/**
 * @typedef {{key: string, value: string}[]} Headers
 */

/**
 * @typedef {object} VercelJson
 * @property {string} installCommand the command to install the compiler
 * @property {string} buildCommand the command to build the compiler
 * @property {{source: string, headers: Headers}[]} headers the headers to set
 * @property {{source: string, destination: string}[]} rewrites Rewrite rules
 */

const /** @type {VercelJson} */ vercelJson = JSON.parse(
  fs.readFileSync( '../vercel.json', 'utf8' )
)
const {
  headers: [{ headers }],
} = vercelJson

;( async () => {
  const app = express()

  app.all( '*', async ( req, res, _next ) => {
    for ( const { key, value } of headers ) {
      res.setHeader( key, value )
    }

    if ( req.method === 'OPTIONS' ) {
      res.end()
    } else {
      handler( req, res )
    }
  })

  const isHttps = false
  const httpServer = isHttps
    ? https.createServer( SERVER_CERTS, app )
    : http.createServer( app )

  await /** @type {Promise<void>} */ (
    new Promise(( resolve, reject ) => {
      console.log( 'compiler listen on port', { SERVER_PORT })

      httpServer.listen( SERVER_PORT, '0.0.0.0', () => {
        resolve()
      })

      httpServer.on( 'error', reject )
    })
  )

  console.log(
    `  > Compiler: http${
      isHttps ? 's' : ''
    }://${SERVER_NAME}:${SERVER_PORT}/`
  )
})()
