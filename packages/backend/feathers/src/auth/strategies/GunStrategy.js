
import {
  AuthenticationBaseStrategy,
} from '@feathersjs/authentication'
import { createDebug } from '@feathersjs/commons'


const debug = createDebug( '@feathersjs/authentication/jwt' )


export class GunStrategy extends AuthenticationBaseStrategy {
  get configuration() {
    const
      authConfig = this.authentication.configuration,
      config = super.configuration

    return {
      service: authConfig.service,
      entity: authConfig.entity,
      header: 'Authorization',
      ...config
    }
  }

  async authenticate( authentication, params ) {
    const { proof } = authentication
    // const config = this.configuration

    console.log( 'AUTHENTICATE:', proof )

    return {
      userID: 'test',
    }
  }
}
