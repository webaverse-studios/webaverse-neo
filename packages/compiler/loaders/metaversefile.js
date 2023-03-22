import path from 'path'

import {
  absoluteImportRegex,
  fetchFileFromId,
  httpsRegex,
  parseJson,
} from '../utils'

/**
 * @typedef {object} Metaversefile
 * @property {string} name the name
 * @property {string} description the description
 * @property {string} start_url the start_url
 * @property {Array<string>} components the components
 */

/**
 * Map a .metaversefile url to a background.js url
 *
 * @param {object} params the params
 * @param {string} params.id the .metaversefile url
 * @param {string} params.start_url the start_url from the .metaversefile
 * @returns {string} mapped url
 * @throws {Error} if the .metaversefile scheme is unknown
 */
function mapUrl({ id, start_url }) {
  if ( httpsRegex.test( start_url )) {
    return new URL( start_url ).toString()
  } else if ( httpsRegex.test( id )) {
    const url = new URL( id )
    url.pathname = path.join( path.dirname( url.pathname ), start_url )
    return url.toString()
  } else if ( absoluteImportRegex.test( id )) {
    const url = new URL( id )
    url.pathname = path.join( path.dirname( url.pathname ), start_url )
    return url.toString()
  } else {
    throw new Error( '.metaversefile scheme unknown' )
  }
}

/**
 * Make a hash from a .metaversefile
 *
 * @param {object} root root params
 * @param {string} root.mapped_start_url the mapped start_url
 * @param {string} root.name the name
 * @param {string} root.description the description
 * @param {string[]} root.components the components
 * @returns {string} the hash
 * @throws {Error} if the .metaversefile scheme is unknown
 */
function makeHash({ mapped_start_url, name, description, components }) {
  const searchParams = new URLSearchParams()
  searchParams.set( 'contentId', mapped_start_url )

  if ( name ) {
    searchParams.set( 'name', name )
  }
  if ( description ) {
    searchParams.set( 'description', description )
  }
  if ( Array.isArray( components )) {
    searchParams.set( 'components', JSON.stringify( components ))
  }

  const params = searchParams.toString()
  return params ? '#' + params : ''
}

const metaversefile = {
  async resolveId( id ) {
    const file = await fetchFileFromId( id, 'utf8' )
    if ( file == null ) {
      throw new Error( '.metaversefile could not be loaded' )
    }

    /** @type {any | Error} */
    const parsedJson = parseJson( file )

    if ( typeof parsedJson == Error ) {
      throw new Error(
        '.metaversefile could not be parsed: ' + parsedJson.stack
      )
    }

    const { name, description, start_url, components } = parsedJson
    if ( !start_url ) {
      throw new Error( '.metaversefile has no "start_url": string', {
        id,
        file,
      })
    }

    const mapped_start_url = mapUrl({ id, start_url })
    if ( mapped_start_url ) {
      return (
        mapped_start_url +
        makeHash({
          mapped_start_url,
          name,
          description,
          components,
        })
      )
    } else {
      return mapped_start_url
    }
  },
}

export default metaversefile
