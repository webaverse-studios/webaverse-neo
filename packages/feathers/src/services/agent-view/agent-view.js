// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  agentViewDataValidator,
  agentViewPatchValidator,
  agentViewQueryValidator,
  agentViewResolver,
  agentViewExternalResolver,
  agentViewDataResolver,
  agentViewPatchResolver,
  agentViewQueryResolver
} from './agent-view.schema.js'
import { AgentViewService, getOptions } from './agent-view.class.js'
import {generateHash} from "../../util.js";

export const agentViewPath = 'agent-view'
export const agentViewMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './agent-view.class.js'
export * from './agent-view.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const agentView = (app) => {
  // Register our service on the Feathers application
  app.use(agentViewPath, new AgentViewService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: agentViewMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(agentViewPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
      ]
    },
    before: {
      all: [
      ],
      find: [],
      get: [],
      create: [
        function (context) {
          context.data.id = generateHash(context.data.hash_condition)
          console.log('context', context)
        }
      ],
      patch: [
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
