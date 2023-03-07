// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import {disallow} from 'feathers-hooks-common';

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  fileMetadataDataValidator,
  fileMetadataPatchValidator,
  fileMetadataQueryValidator,
  fileMetadataResolver,
  fileMetadataExternalResolver,
  fileMetadataDataResolver,
  fileMetadataPatchResolver,
  fileMetadataQueryResolver
} from './file-metadata.schema.js'
import { FileMetadataService, getOptions } from './file-metadata.class.js'

export const fileMetadataPath = 'file-metadata'
export const fileMetadataMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './file-metadata.class.js'
export * from './file-metadata.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const fileMetadata = (app) => {
  // Register our service on the Feathers application
  app.use(fileMetadataPath, new FileMetadataService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: fileMetadataMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(fileMetadataPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        // schemaHooks.resolveExternal(fileMetadataExternalResolver),
        // schemaHooks.resolveResult(fileMetadataResolver)
      ]
    },
    before: {
      all: [
        disallow('external'),
        // schemaHooks.validateQuery(fileMetadataQueryValidator),
        // schemaHooks.resolveQuery(fileMetadataQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        // schemaHooks.validateData(fileMetadataDataValidator),
        // schemaHooks.resolveData(fileMetadataDataResolver)
      ],
      patch: [
        // schemaHooks.validateData(fileMetadataPatchValidator),
        // schemaHooks.resolveData(fileMetadataPatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
