import fs from 'fs'
import path from 'path'

import Babel from '@babel/core'
import dataUrls from 'data-urls'
import fetch from 'node-fetch'

import { getCwd, parseIdHash } from '../utils'

const textDecoder = new TextDecoder()

const jsx = {
  async load( id ) {
    let src
    if ( /https?:/i.test( id )) {
      const url = new URL( id )
      url.searchParams.append( 'noimport', '1' )
      id = url.toString()

      const res = await fetch( id )

      if ( res.ok ) {
        src = await res.text()
      } else {
        throw new Error( `invalid status code: ${res.status} "${id}"` )
      }
    } else if ( /^data:/.test( id )) {
      const dataUrl = dataUrls( id )
      if ( dataUrl ) {
        const { body } = dataUrl
        src = textDecoder.decode( body )
      } else {
        throw new Error( 'invalid data url: ', { id })
      }
    } else {
      let localPath = '.' + id.replace( /#[\s\S]+$/, '' )
      const cwd = getCwd()
      localPath = path.resolve( cwd, localPath )
      src = await fs.promises.readFile( localPath, 'utf8' )
    }

    const { contentId, name, description, components } = parseIdHash( id )

    const spec = Babel.transform( src, {
      presets: ['@babel/preset-react'],
    })
    let { code } = spec
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
