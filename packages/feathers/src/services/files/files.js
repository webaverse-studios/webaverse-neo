// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import {keep, disallow} from 'feathers-hooks-common'

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

import pkg from 'dauria';
const { getBase64DataURI } = pkg;

export const filesPath = 'files'
export const filesMethods = ['get', 'create', 'remove']

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
        // disallow('external'),
        // schemaHooks.resolveExternal(filesExternalResolver),
        // schemaHooks.resolveResult(filesResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(filesQueryValidator), schemaHooks.resolveQuery(filesQueryResolver)],
      find: [],
      get: [],
      create: [
        async function(context) {
          if (!context.data.uri && context.data.file) {
            const file = context.data.file;
            console.log('file', file);
            const array = await file.arrayBuffer();
            const buffer = Buffer.from(array);
            context.data.type = file.type;
            context.data.uri = getBase64DataURI(buffer, file.type);
          }
        },
        keep('uri', 'id', 'type'),
        ],
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
