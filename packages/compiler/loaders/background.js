import fs from 'fs'
import path from 'path'

import { fillTemplate, parseIdHash } from '../utils'

const templateString = fs.readFileSync(
  path.resolve( '.', 'public', 'type_templates', 'background.js' ),
  'utf8'
)

/**
 * @type {import('../plugins/metaversefilePlugin').MetaverseFilePluigin}
 */
const backgroundLoader = {
  load( id ) {
    const { contentId, name, description, components } = parseIdHash( id )

    const code = fillTemplate( templateString, {
      srcUrl: JSON.stringify( id ),
      contentId: JSON.stringify( contentId ),
      name: JSON.stringify( name ),
      description: JSON.stringify( description ),
      components: JSON.stringify( components ),
    })

    return {
      code,
      map: null,
    }
  },
}

export default backgroundLoader
