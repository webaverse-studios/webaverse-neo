
import { Params } from '@feathersjs/feathers'
import {
  AuthenticationBaseStrategy,
  AuthenticationResult,
  AuthenticationService
} from '@feathersjs/authentication'

class AnonymousStrategy extends AuthenticationBaseStrategy {
  async authenticate(authentication, params: Params) {
    const { signature } = this.configuration


    return {
      userID:
    }
  }
}

export default function (app: Application) {
  const authentication = new AuthenticationService(app)
  // ... authentication service setup
  authentication.register('anonymous', new AnonymousStrategy())
}
