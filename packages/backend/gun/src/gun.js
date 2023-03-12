import { gunConfig } from '@webaverse-studios/config'

// GUN modules are imported here.
import GUN from 'gun'
import 'gun/lib/promise.js'

import { server } from '#Server'


const { url } = gunConfig


export const
  // Create a new GUN instance which hooks into the HTTP server.
  gun = GUN({ web: server })


console.log( `GUN relay active @ ${url}` )
