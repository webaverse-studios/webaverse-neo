import fs from 'fs'
import path from 'path'

import fetch from 'node-fetch'

import metaversefileLoader from './metaversefile.js'
import { absoluteImportRegex, getCwd, httpsRegex } from '../utils'

/**
 * @type {import('../plugins/metaversefilePlugin').MetaverseFilePluigin}
 */
const directoryLoader = {
  async resolveId( id ) {
    if ( httpsRegex.test( id ) && /\/$/.test( id )) {
      const metaversefilePath = id + '.metaversefile'
      const res = await fetch( metaversefilePath, {
        method: 'HEAD',
      })

      if ( !res.ok ) {
        const indexHtmlPath = id + 'index.html'
        const res = await fetch( indexHtmlPath, {
          method: 'HEAD',
        })

        if ( !res.ok ) {
          throw new Error(
            `directory index.html fetch failed: ${res.status} "${id}"`
          )
        }
        return indexHtmlPath
      }

      return await metaversefileLoader.resolveId( metaversefilePath, id )
    }

    if ( absoluteImportRegex.test( id )) {
      const cwd = getCwd()
      id = path.resolve( id )

      const idFullPath = path.join( cwd, id )
      const isDirectory = await new Promise(( resolve ) => {
        fs.lstat( idFullPath, ( err, stats ) => {
          resolve( !err && stats.isDirectory())
        })
      })

      if ( !isDirectory ) {
        throw new Error( `not a directory: "${id}"` )
      }

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

        return await metaversefileLoader.resolveId( fakeId, fakeImporter )
      } else {
        const indexHtmlPath = path.join( id, 'index.html' )
        const indexHtmlFullPath = path.join( cwd, indexHtmlPath )
        const indexHtmlExists = await new Promise(( resolve ) => {
          fs.lstat( indexHtmlFullPath, ( err, stats ) => {
            resolve( !err && stats.isFile())
          })
        })

        if ( !indexHtmlExists ) {
          throw new Error( `directory index.html does not exist: "${id}"` )
        }

        return indexHtmlPath
      }
    }

    throw new Error( `unknown path format: "${id}"` )
  },
}

export default directoryLoader
