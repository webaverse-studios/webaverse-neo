import fs from 'fs'
import path from 'path'

import { fillTemplate, parseIdHash } from '../utils'

const templateString = fs.readFileSync(
  path.resolve( '.', 'public', 'type_templates', 'scn.js' ),
  'utf8'
)

/**
 * @type {import('../plugins/metaversefilePlugin').MetaverseFilePluigin}
 */
const scnLoader = {
  async load( id ) {
    const { contentId, name, description, components } = parseIdHash( id )

    const code = fillTemplate( templateString, {
      srcUrl: JSON.stringify( id ),
      name: JSON.stringify( name ),
      contentId: JSON.stringify( contentId ),
      description: JSON.stringify( description ),
      components: JSON.stringify( components ),
    })

    return {
      code,
      map: null,
    }
  },
}

export default scnLoader
