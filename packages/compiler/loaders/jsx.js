import fs from 'fs'
import path from 'path'

import Babel from '@babel/core'
import dataUrls from 'data-urls'
import fetch from 'node-fetch'

import { getCwd, parseIdHash } from '../utils'

const textDecoder = new TextDecoder()

/**
 * @type {import('../plugins/metaversefilePlugin').MetaverseFilePluigin}
 */
const jsx = {
  async load( id ) {
    let src
    if ( /https?:/i.test( id )) {
      const url = new URL( id )
      url.searchParams.append( 'noimport', '1' )
      id = url.toString()

      const res = await fetch( id )
      if ( !res.ok ) {
        throw new Error( `invalid status code: ${res.status} "${id}"` )
      }

      src = await res.text()
    } else if ( /^data:/.test( id )) {
      const dataUrl = dataUrls( id )
      if ( !dataUrl ) {
        throw new Error( 'invalid data url: ', { id })
      }

      const { body } = dataUrl
      src = textDecoder.decode( body )
    } else {
      let localPath = '.' + id.replace( /#[\s\S]+$/, '' )
      localPath = path.resolve( getCwd(), localPath )
      src = await fs.promises.readFile( localPath, 'utf8' )
    }

    const { contentId, name, description, components } = parseIdHash( id )

    let { code } = Babel.transform( src, {
      presets: ['@babel/preset-react'],
    })

    code += `

export const contentId = ${JSON.stringify( contentId )};
export const name = ${JSON.stringify( name )};
export const description = ${JSON.stringify( description )};
export const type = 'js';
export const components = ${JSON.stringify( components )};
`
    return {
      code,
      map: null,
    }
  },
}

export default jsx
