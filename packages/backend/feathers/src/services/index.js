import { fileMetadata } from './file-metadata/file-metadata.js'

import { files } from './files/files.js'

import { user } from './users/users.js'

export const services = ( app ) => {
  // All services will be registered here

  app.configure( fileMetadata )
  app.configure( files )
  app.configure( user )
}
