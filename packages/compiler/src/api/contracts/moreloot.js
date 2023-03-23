import fs from 'fs'
import path from 'path'

import { fillTemplate, parseIdHash } from '../../utils/index.js'

const templateString = fs.readFileSync(
  path.resolve('..', 'public', 'contract_templates', 'moreloot.js'),
  'utf8',
)

/**
 * @type {import('../src/api/plugins/metaversefilePlugin').MetaverseFilePluigin}
 */
const moreLootLoader = {
  resolveId( source ) {
    return source
  },
  async load( id ) {
    id = id.replace( /^(eth?:\/(?!\/))/, '$1/' )

    const match = id.match( /^eth:\/\/(0x[0-9a-f]+)\/([0-9]+)$/i )
    if ( match ) {
      const contractAddress = match[1]
      const tokenId = parseInt( match[2], 10 )

      const { contentId, name, description, components } = parseIdHash( id )

      const code = fillTemplate( templateString, {
        contractAddress,
        tokenId,
        contentId,
        name,
        description,
        components,
      })

      return {
        code,
        map: null,
      }
    } else {
      return null
    }
  },
}

export default moreLootLoader
