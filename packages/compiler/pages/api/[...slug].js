/* eslint-disable no-console */
/* eslint-disable max-len */

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fs from 'fs'
import path from 'path'

import etag from 'etag'

import { absoluteImportRegex, getCwd } from '../../utils'
import compile from '../../utils/compile.js'

/**
 * Proxy request
 *
 * @type {import('next').NextApiHandler}
 */
const proxyRequest = ( req, res, url ) =>
  new Promise(( _resolve, reject ) => {
    console.log( '[Compiler]: proxyRequest', { url })

    res.setHeader( 'Access-Control-Allow-Methods', '*' )
    res.setHeader( 'Access-Control-Allow-Headers', '*' )
    res.setHeader( 'Access-Control-Allow-Origin', '*' )
    res.setHeader( 'Cross-Origin-Opener-Policy', 'unsafe-none' )
    res.setHeader( 'Cross-Origin-Embedder-Policy', 'require-corp' )
    res.setHeader( 'Cross-Origin-Resource-Policy', 'cross-origin' )

    if ( !absoluteImportRegex.test( url )) {
      return res.redirect( url )
    }

    const cwd = getCwd()
    url = path.join( cwd, url )

    console.log( '[Compiler]: fetch file locally', { cwd, url })

    const rs = fs.createReadStream( url )
    rs.pipe( res )
    rs.on( 'error', ( err ) => {
      console.warn( 'got error', err.stack )
      reject( err )
    })
  })

/**
 * Handle requests
 *
 * @type {import('next').NextApiHandler}
 */
export default async function handler( req, res ) {
  console.log( '[Compiler]: Request Received', req.url )

  const url = req.url
    .replace( /^\/([a-zA-Z0-9]+:)/, '$1' ) // remove initial slash
    .replace( /^([a-zA-Z0-9]+:\/(?!\/))/, '$1/' ) // add second slash to protocol, since it is truncated

  if ( !url ) {
    res.status( 404 ).send( 'not found' )
  }

  // XXX note: sec-fetch-dest is not supported by Safari
  const dest = req.headers['sec-fetch-dest']
  if (['empty', 'image'].includes( dest ) || dest.includes( 'github.io' )) {
    await proxyRequest( req, res, url )
  } else {
    let resultUint8Array, err
    try {
      resultUint8Array = await compile( url )
    } catch ( e ) {
      err = e
    }

    if ( err ) {
      console.warn( err )
      return res.status( 500 ).send( err.stack )
    }

    const resultBuffer = Buffer.from( resultUint8Array )
    const et = etag( resultBuffer )
    res.setHeader( 'ETag', et )

    // check if-none-match (multiple)
    if (
      req.headers['if-none-match'] &&
      req.headers['if-none-match'].split( ',' ).includes( et )
    ) {
      res.statusCode = 304
      res.setHeader( 'Access-Control-Allow-Methods', '*' )
      res.setHeader( 'Access-Control-Allow-Headers', '*' )

      res.setHeader( 'Cache-Control', 'no-cache' )
      res.setHeader( 'Access-Control-Allow-Origin', '*' )
      res.setHeader( 'Cross-Origin-Opener-Policy', 'unsafe-none' )
      res.setHeader( 'Cross-Origin-Embedder-Policy', 'require-corp' )
      res.setHeader( 'Cross-Origin-Resource-Policy', 'cross-origin' )
      console.log( '[Compiler]: 304', url )
      res.end()
    } else {
      console.log( '[Compiler]: 200', url )
      res.setHeader( 'Content-Type', 'application/javascript' )

      res.setHeader( 'Access-Control-Allow-Methods', '*' )
      res.setHeader( 'Access-Control-Allow-Headers', '*' )

      res.setHeader( 'Cache-Control', 'no-cache' )
      res.setHeader( 'Access-Control-Allow-Origin', '*' )
      res.setHeader( 'Cross-Origin-Opener-Policy', 'unsafe-none' )
      res.setHeader( 'Cross-Origin-Embedder-Policy', 'require-corp' )
      res.setHeader( 'Cross-Origin-Resource-Policy', 'cross-origin' )
      res.end( resultBuffer )
    }
  }
}
