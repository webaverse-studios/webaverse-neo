// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const filesSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'Files', additionalProperties: false }
)
export const filesValidator = getValidator(filesSchema, dataValidator)
export const filesResolver = resolve({})

export const filesExternalResolver = resolve({})

// Schema for creating new entries
export const filesDataSchema = Type.Pick(filesSchema, ['text'], {
  $id: 'FilesData'
})
export const filesDataValidator = getValidator(filesDataSchema, dataValidator)
export const filesDataResolver = resolve({})

// Schema for updating existing entries
export const filesPatchSchema = Type.Partial(filesSchema, {
  $id: 'FilesPatch'
})
export const filesPatchValidator = getValidator(filesPatchSchema, dataValidator)
export const filesPatchResolver = resolve({})

// Schema for allowed query properties
export const filesQueryProperties = Type.Pick(filesSchema, ['id', 'text'])
export const filesQuerySchema = Type.Intersect(
  [
    querySyntax(filesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const filesQueryValidator = getValidator(filesQuerySchema, queryValidator)
export const filesQueryResolver = resolve({})
