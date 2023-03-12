// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
import {
  AuthenticationService,
  // JWTStrategy,
} from '@feathersjs/authentication'
// import { LocalStrategy } from '@feathersjs/authentication-local'
import {GunStrategy} from './auth/strategies/GunStrategy.js'

export const authentication = ( app ) => {
  const authentication = new AuthenticationService( app )

  // authentication.register( 'jwt', new JWTStrategy())
  // authentication.register( 'local', new LocalStrategy())
  authentication.register( 'gun', new GunStrategy())

  app.use( 'authentication', authentication )
}
