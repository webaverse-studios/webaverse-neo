import { parseJson } from './parseJson.js'

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
