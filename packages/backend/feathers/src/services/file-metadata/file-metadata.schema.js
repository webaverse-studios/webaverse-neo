// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import {resolve} from '@feathersjs/schema'
import {Type, getValidator, querySyntax} from '@feathersjs/typebox'

import {dataValidator, queryValidator} from '../../validators.js'

/**
 *
 */
function ExtraSchema() {
  return Type.Object({
    [Type.Any()]: Type.Any(),
  })
}

// Main data model schema
export const fileMetadataSchema = Type.Object(
  {
    id: Type.String(),
    metadata: Type.Object(
      {
        type: Type.String(),
        size: Type.Number(),
      }
    ),
    //   optional extra information in an object
    extra: Type.Optional( ExtraSchema ),
  },
  {$id: 'FileMetadata', additionalProperties: false}
)
export const fileMetadataValidator = getValidator( fileMetadataSchema, dataValidator )
export const fileMetadataResolver = resolve({})

export const fileMetadataExternalResolver = resolve({})

// Schema for creating new entries
export const fileMetadataDataSchema = Type.Pick( fileMetadataSchema, ['metadata', 'extra'], {
  $id: 'FileMetadataData'
})
export const fileMetadataDataValidator = getValidator( fileMetadataDataSchema, dataValidator )
export const fileMetadataDataResolver = resolve({})

// Schema for updating existing entries
export const fileMetadataPatchSchema = Type.Partial( fileMetadataSchema, {
  $id: 'FileMetadataPatch'
})
export const fileMetadataPatchValidator = getValidator( fileMetadataPatchSchema, dataValidator )
export const fileMetadataPatchResolver = resolve({})

// Schema for allowed query properties
export const fileMetadataQueryProperties = Type.Pick( fileMetadataSchema, ['id', 'metadata', 'extra'])
export const fileMetadataQuerySchema = Type.Intersect(
  [
    querySyntax( fileMetadataQueryProperties ),
    // Add additional query properties here
    Type.Object({}, {additionalProperties: false})
  ],
  {additionalProperties: false}
)
export const fileMetadataQueryValidator = getValidator( fileMetadataQuerySchema, queryValidator )
export const fileMetadataQueryResolver = resolve({})
