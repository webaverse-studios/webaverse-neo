// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import {authenticate} from '@feathersjs/authentication'
import {keep, disallow} from 'feathers-hooks-common'

import {hooks as schemaHooks} from '@feathersjs/schema'
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
import {FilesService, getOptions} from './files.class.js'

import pkg from 'dauria';
import {generateHash} from "../../util.js";

const {getBase64DataURI} = pkg;

import multer from 'multer';

export const filesPath = 'files'
const multiware = multer()
export const filesMethods = ['get', 'create', 'remove']

export * from './files.class.js'
export * from './files.schema.js'


function createMetadataAndSetID() {
  return async function (context) {
    const {data} = context;

    // send metadata to file-metadata service
    const fileMetadata = await context.app.service('file-metadata').create(data);
    return context
  }
}

// A configure function that registers the service and its hooks via `app.configure`
export const files = (app) => {
  // Register our service on the Feathers application
  app.use(filesPath,
    new FilesService(getOptions(app)), {
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
      ]
    },
    before: {
      all: [],
      find: [],
      get: [],
      create: [
        async function (context) {
          context.data.id = generateHash(context.data.hash_condition);
          return context;
        },
        createMetadataAndSetID(),
        async function (context) {
          if (!context.data.uri && context.data.file) {
            const file = context.data.file;
            context.data.uri = getBase64DataURI(file, context.data.metadata.type);
            context.data.type = context.data.metadata.type;
          }
        },
        keep('uri', 'id', 'type'),
      ],
      patch: [],
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
