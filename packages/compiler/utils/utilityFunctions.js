import fs from 'fs'
import path from 'path'

import fetch from 'node-fetch'

import { httpsRegex } from './regex'

/**
 * Parse a JSON string, returning null if it fails.
 *
 * @param {string} jsonString the JSON string
 * @returns {any | Error} the parsed JSON
 */
export function parseJson( jsonString ) {
  try {
    return JSON.parse( jsonString )
  } catch ( err ) {
    return err
  }
}

export const getCwd = () =>
  path.resolve( process.cwd(), process.env.BASE_CWD ?? '' )

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

/**
 * Fill a template string with variables
 *
 * @param {string} templateString the template string
 * @param {any[]} templateVars the template variables
 * @returns {string} the filled template
 */
export const fillTemplate = function ( templateString, templateVars ) {
  return new Function( 'return `' + templateString + '`;' ).call( templateVars )
}

/**
 * Parse a hash from an id
 *
 * @param {string} id the id
 * @returns {{
 * name: string,
 * contentId: string,
 * components: string[],
 * description: string
 * }} the parsed hash
 */
export const parseIdHash = ( id ) => {
  let name = ''
  let contentId = ''
  let components = []
  let description = ''

  const match = id.match( /#([\s\S]+)$/ )
  if ( match ) {
    const queryParams = new URLSearchParams( match[1])
    const qContentId = queryParams.get( 'contentId' )
    if ( qContentId !== undefined ) {
      contentId = qContentId
    }
    const qName = queryParams.get( 'name' )
    if ( qName !== undefined ) {
      name = qName
    }
    const qDescription = queryParams.get( 'description' )
    if ( qDescription !== undefined ) {
      description = qDescription
    }
    const qComponents = queryParams.get( 'components' )
    if ( qComponents !== undefined ) {
      components = parseJson( qComponents ) ?? []
    }
  }

  if ( !contentId ) {
    contentId = id.match( /^([^#]*)/ )[1]
  }

  if ( !name ) {
    if ( /^data:/.test( contentId )) {
      name = contentId.match( /^data:([^;,]*)/ )[1]
    } else {
      name = contentId.match( /([^/.]*)(?:\.[a-zA-Z0-9]*)?$/ )[1]
    }
  }

  return {
    name,
    contentId,
    components,
    description,
  }
}
