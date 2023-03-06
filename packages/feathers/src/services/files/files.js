// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  filesDataValidator,
  filesPatchValidator,
  filesQueryValidator,
  filesResolver,
  filesExternalResolver,
  filesDataResolver,
  filesPatchResolver,
  filesQueryResolver
} from './files.schema.js'
import { FilesService, getOptions } from './files.class.js'

export const filesPath = 'files'
export const filesMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './files.class.js'
export * from './files.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const files = (app) => {
  // Register our service on the Feathers application
  app.use(filesPath, new FilesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: filesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(filesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(filesExternalResolver),
        schemaHooks.resolveResult(filesResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(filesQueryValidator), schemaHooks.resolveQuery(filesQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(filesDataValidator), schemaHooks.resolveData(filesDataResolver)],
      patch: [schemaHooks.validateData(filesPatchValidator), schemaHooks.resolveData(filesPatchResolver)],
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
