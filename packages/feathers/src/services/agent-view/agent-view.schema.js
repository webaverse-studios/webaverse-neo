// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Extra data that can be context specific. For example store the userIDs of the users that were mentioned in a message.
const ExtraSchema = Type.Object({
  [Type.String()]: Type.Any(),
});

const ImageSchema = Type.Object({
  data: Type.String(),
  type: Type.String(),
  size: Type.Integer(),
});

// Main data model schema
export const agentViewSchema = Type.Object(
  {
    hash_condition: Type.Object(
      {
        agentID: Type.String(),
      }
    ),
    image: ImageSchema,
    uri: Type.Optional(Type.String()),
    extra: Type.Optional(ExtraSchema),
  },
  { $id: 'AgentView', additionalProperties: false }
)
export const agentViewValidator = getValidator(agentViewSchema, dataValidator)
export const agentViewResolver = resolve({})

export const agentViewExternalResolver = resolve({})

// Schema for creating new entries
export const agentViewDataSchema = Type.Pick(agentViewSchema, ['metadata, extra'], {
  $id: 'AgentViewData'
})
export const agentViewDataValidator = getValidator(agentViewDataSchema, dataValidator)
export const agentViewDataResolver = resolve({})

// Schema for updating existing entries
export const agentViewPatchSchema = Type.Partial(agentViewSchema, {
  $id: 'AgentViewPatch'
})
export const agentViewPatchValidator = getValidator(agentViewPatchSchema, dataValidator)
export const agentViewPatchResolver = resolve({})

// Schema for allowed query properties
export const agentViewQueryProperties = Type.Pick(agentViewSchema, ['id', 'metadata, extra'])
export const agentViewQuerySchema = Type.Intersect(
  [
    querySyntax(agentViewQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const agentViewQueryValidator = getValidator(agentViewQuerySchema, queryValidator)
export const agentViewQueryResolver = resolve({})
