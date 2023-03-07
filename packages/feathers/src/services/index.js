import { agentView } from './agent-view/agent-view.js'

import { fileMetadata } from './file-metadata/file-metadata.js'

import { files } from './files/files.js'

import { user } from './users/users.js'

export const services = (app) => {
  app.configure(fileMetadata)

  app.configure(agentView)

  app.configure(files)

  app.configure(user)

  // All services will be registered here
}
