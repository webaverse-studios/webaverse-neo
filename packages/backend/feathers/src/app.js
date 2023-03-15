// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import configuration from '@feathersjs/configuration'
import { feathers } from '@feathersjs/feathers'
import { bodyParser, cors, errorHandler, koa, parseAuthentication, rest, serveStatic } from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'

import { authentication } from './authentication.js'
import { channels } from './channels.js'
import { configurationValidator } from './configuration.js'
import { logError } from './hooks/log-error.js'
import { services } from './services/index.js'
import { sqlite } from './sqlite.js'



const app = koa( feathers())

// Load our app configuration (see config/ folder)
app.configure( configuration( configurationValidator ))

// Set up Koa middleware
app.use( cors())
app.use( serveStatic( app.get( 'public' )))
app.use( errorHandler())
app.use( parseAuthentication())
app.use( bodyParser())

// Configure services and transports
app.configure( rest())
app.configure(
  socketio({
    cors: {
      origin: app.get( 'origins' )
    }
  })
)
app.configure( channels )
app.configure( sqlite )

app.configure( authentication )

app.configure( services )

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }
