import fs from 'fs'
import path from 'path'

import fetch from 'node-fetch'

import { getCwd } from './getCwd.js'
import { httpsRegex } from '../lib/regex.js'

export const readFile = async ( id ) => {
  if ( httpsRegex.test( id )) {
    const res = await fetch( id )
    return await res.text()
  } else {
    // read from disk
    const rs = fs.createReadStream( id )
    const chunks = []
    for await ( const chunk of rs ) {
      chunks.push( chunk )
    }
    return Buffer.concat( chunks ).toString( 'utf8' )
  }
}

/**
 * Fetch a file from an id
 *
 * @param {string} id the id
 * @param {string} encoding 'utf8' or null
 * @returns {Promise<string | Buffer | null>} the file contents
 */
export const fetchFileFromId = async ( id, encoding = null ) => {
  if ( httpsRegex.test( id )) {
    const url = new URL( id )
    url.searchParams.append( 'noimport', '1' )
    id = url.toString()

    const res = await fetch( id )

    if ( encoding === 'utf8' ) {
      return await res.text()
    } else {
      const arrayBuffer = await res.arrayBuffer()
      const buffer = Buffer.from( arrayBuffer )
      return buffer
    }
  } else {
    return await new Promise(( resolve, reject ) => {
      const cwd = getCwd()
      const localPath = path.join( cwd, id.replace( /^[/\\]+/, '' ))
      fs.readFile( localPath, encoding, ( err, d ) => {
        if ( !err ) {
          resolve( d )
        } else {
          if ( err.code === 'ENOENT' ) {
            resolve( null )
          } else {
            reject( err )
          }
        }
      })
    })
  }
}
