import fs from 'fs'
import path from 'path'

import fetch from 'node-fetch'

import metaversefileLoader from './metaversefile.js'
import {
  absoluteImportRegex,
  fillTemplate,
  getCwd,
  httpsRegex,
} from '../utils'

const templateString = fs.readFileSync(
  path.resolve( '.', 'public', 'type_templates', 'html.js' ),
  'utf8'
)

const _resolveHtml = async ( id ) => {
  const code = fillTemplate( templateString, {
    srcUrl: JSON.stringify( id ),
  })
  return {
    code,
    map: null,
  }
}

export default {
  async resolveId( id ) {
    if ( httpsRegex.test( id ) && /\/$/.test( id )) {
      const metaversefilePath = id + '.metaversefile'
      const res = await fetch( metaversefilePath, {
        method: 'HEAD',
      })
      if ( res.ok ) {
        const metaversefileStartUrl = await metaversefileLoader.resolveId(
          metaversefilePath,
          id
        )
        return metaversefileStartUrl
      } else {
        const indexHtmlPath = id + 'index.html'
        const res = await fetch( indexHtmlPath, {
          method: 'HEAD',
        })
        if ( res.ok ) {
          return indexHtmlPath
        } else {
          throw new Error(
            `directory index.html fetch failed: ${res.status} "${id}"`
          )
        }
      }
    } else if ( absoluteImportRegex.test( id )) {
      const cwd = getCwd()
      id = path.resolve( id )
      const idFullPath = path.join( cwd, id )
      const isDirectory = await new Promise(( resolve ) => {
        fs.lstat( idFullPath, ( err, stats ) => {
          resolve( !err && stats.isDirectory())
        })
      })
      if ( isDirectory ) {
        const metaversefilePath = path.join( id, '.metaversefile' )
        const metaversefileFullPath = path.join( cwd, metaversefilePath )
        const metaversefileExists = await new Promise(( resolve ) => {
          fs.lstat( metaversefileFullPath, ( err, stats ) => {
            resolve( !err && stats.isFile())
          })
        })
        if ( metaversefileExists ) {
          const fakeImporter = path.join( id, '.fakeFile' )
          const fakeId = path.join(
            path.dirname( fakeImporter ),
            '.metaversefile'
          )
          const metaversefileStartUrl = await metaversefileLoader.resolveId(
            fakeId,
            fakeImporter
          )
          return metaversefileStartUrl
        } else {
          const indexHtmlPath = path.join( id, 'index.html' )
          const indexHtmlFullPath = path.join( cwd, indexHtmlPath )
          const indexHtmlExists = await new Promise(( resolve ) => {
            fs.lstat( indexHtmlFullPath, ( err, stats ) => {
              resolve( !err && stats.isFile())
            })
          })

          if ( indexHtmlExists ) {
            return indexHtmlPath
          } else {
            throw new Error( `directory index.html does not exist: "${id}"` )
          }
        }
      } else {
        throw new Error( `not a directory: "${id}"` )
      }
    } else {
      throw new Error( `unknown path format: "${id}"` )
    }
  },
}
