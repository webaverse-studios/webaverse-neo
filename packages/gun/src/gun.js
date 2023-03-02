import GUN from 'gun'

// GUN modules are imported here.
import 'gun/lib/promise.js'

import { server } from '#Server'


const { PORT } = process.env


export const
  // Create a new GUN instance which hooks into the HTTP server.
  gun = GUN({ web: server })


console.log( `GUN relay active @ https://localhost:${PORT}/gun` )
//console.log( 'ADMIN:', admin )
