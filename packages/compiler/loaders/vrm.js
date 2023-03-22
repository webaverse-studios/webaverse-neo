import fs from 'fs'
import path from 'path'

import { fillTemplate, parseIdHash } from '../utils'

const templateString = fs.readFileSync(
  path.resolve( '.', 'public', 'type_templates', 'vrm.js' ),
  'utf8'
)

/**
 * @type {import('../plugins/metaversefilePlugin').MetaverseFilePluigin}
 */
const vrmLoader = {
  async load( id ) {
    const { contentId, name, description, components } = parseIdHash( id )

    const code = fillTemplate( templateString, {
      srcUrl: JSON.stringify( id ),
      name: JSON.stringify( name ),
      contentId: JSON.stringify( contentId ),
      components: JSON.stringify( components ),
      description: JSON.stringify( description ),
    })

    return {
      code,
      map: null,
    }
  },
}

export default vrmLoader
