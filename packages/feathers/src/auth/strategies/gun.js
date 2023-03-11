
import { Params } from '@feathersjs/feathers'
import {
  AuthenticationBaseStrategy,
  AuthenticationResult,
  AuthenticationService
} from '@feathersjs/authentication'

class AnonymousStrategy extends AuthenticationBaseStrategy {
  async authenticate(authentication, params) {
    const { signature } = this.configuration


    return {
      userID:
    }
  }
}

export default function (app) {
  const authentication = new AuthenticationService(app)
  // ... authentication service setup
  authentication.register('anonymous', new AnonymousStrategy())
}
