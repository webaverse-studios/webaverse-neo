// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
import { AuthenticationService } from '@feathersjs/authentication'
import { GunStrategy } from './auth/strategies/GunStrategy.js'

export const authentication = (app) => {
  const authentication = new AuthenticationService(app)

  authentication.register('gun', new GunStrategy())

  app.use('authentication', authentication)
}
